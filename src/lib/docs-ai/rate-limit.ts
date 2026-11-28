import { createHash } from "crypto";
import { getDocsDatabase } from "@/lib/mongodb";
import { once } from "./once";
import { DEFAULT_LIMITS, type LimitKey, type RateLimits, type RateUsage } from "./limits";

const ensureIndex = once(async () => (await getDocsDatabase()).collection("ask_rate").createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 }));

const COLLECTION = "ask_rate";
// The admin's limits live in one record of the docs "settings" collection
const SETTINGS = "settings";
const LIMITS_ID = "ask_rate_limits";
// Each server process rereads the limits at most this often, so a save applies everywhere within 15 seconds
const LIMITS_TTL_MS = 15_000;

// The stored settings record: the four limits, when they were saved and by which admin
type LimitsDoc = { _id: string; limits: RateLimits; updatedAt: Date; updatedBy: string };

const memory = new Map<string, number>();
// This process's copy of the limits and when it was read, refreshed after LIMITS_TTL_MS
let cachedLimits: { value: RateLimits; at: number } | null = null;

// The admin's saved limits over the defaults; a database error keeps the last known values (or the defaults)
export async function getRateLimits(): Promise<RateLimits> {
  if (cachedLimits && Date.now() - cachedLimits.at < LIMITS_TTL_MS) return cachedLimits.value;
  try {
    const doc = await (await getDocsDatabase()).collection<LimitsDoc>(SETTINGS).findOne({ _id: LIMITS_ID });
    // Spread over the defaults so a limit added later still has a value on an older record
    cachedLimits = { value: { ...DEFAULT_LIMITS, ...doc?.limits }, at: Date.now() };
  } catch (error) {
    console.error("Ask AI limits read failed:", error);
    return cachedLimits?.value ?? DEFAULT_LIMITS;
  }
  return cachedLimits.value;
}

// The saved record with who saved it, for the settings page; null while the defaults are in use
export async function getLimitsRecord(): Promise<LimitsDoc | null> {
  return (await getDocsDatabase()).collection<LimitsDoc>(SETTINGS).findOne({ _id: LIMITS_ID });
}

// Saves the admin's limits and drops this process's cached copy so they apply here at once
export async function saveRateLimits(limits: RateLimits, updatedBy: string): Promise<LimitsDoc> {
  const doc: LimitsDoc = { _id: LIMITS_ID, limits, updatedAt: new Date(), updatedBy };
  await (await getDocsDatabase()).collection<LimitsDoc>(SETTINGS).replaceOne({ _id: LIMITS_ID }, doc, { upsert: true });
  cachedLimits = null;
  return doc;
}

// The first X-Forwarded-For entry is whatever the client sent, so it can be faked to dodge the limit.
// Prefer headers the proxy sets itself (Netlify, nginx), then the LAST forwarded entry, which the
// nearest proxy appended. shortcut: if a CDN sits in front of nginx, use its client-IP header instead.
export function clientIp(req: Request) {
  const h = req.headers;
  const forwarded = h.get("x-forwarded-for")?.split(",").map((s) => s.trim()).filter(Boolean);
  // Only trust the header the current host's proxy sets: Netlify's on Netlify, nginx's X-Real-IP elsewhere (a client could send either)
  const proxyIp = process.env.NETLIFY ? h.get("x-nf-client-connection-ip") : h.get("x-real-ip");
  return proxyIp || forwarded?.at(-1) || "anonymous";
}

// Counts requests per IP per minute and per day in MongoDB, so every server process shares the count.
// Only a hash of the IP is stored, and records delete themselves after a day.
// Fails open on a database error: a broken limiter should not take Ask AI down.
// `scope` keeps counters apart (questions vs feedback); only the "ask" scope has the daily and overall caps.
export async function checkRate(ip: string, scope: "ask" | "fb" = "ask"): Promise<{ limited: boolean; retryAfter: number }> {
  const limits = await getRateLimits();
  const perMinute = scope === "fb" ? limits.ratingsPerVisitorMinute : limits.perVisitorMinute;
  try {
    const col = (await getDocsDatabase()).collection<{ _id: string; n: number; createdAt: Date }>(COLLECTION);
    await ensureIndex();

    const hash = createHash("sha256").update(ip).digest("hex").slice(0, 32);
    const now = Date.now();
    // The current UTC minute, shared by the per-minute, overall and turned-away counter keys
    const minuteNo = Math.floor(now / 60_000);
    const bump = async (key: string) => {
      const doc = await col.findOneAndUpdate(
        { _id: key },
        { $inc: { n: 1 }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true, returnDocument: "after" }
      );
      return doc?.n ?? 1;
    };
    // Counts a turned-away request against the limit that stopped it, for the 24-hour usage on the settings page
    const block = async (limit: LimitKey, retryAfter: number) => {
      await bump(`b:${limit}:${minuteNo}`);
      return { limited: true, retryAfter };
    };
    const minuteLeft = 60 - Math.floor((now % 60_000) / 1000);
    const minute = await bump(`${scope}:m:${hash}:${minuteNo}`);
    if (minute > perMinute) return block(scope === "fb" ? "ratingsPerVisitorMinute" : "perVisitorMinute", minuteLeft);
    if (scope === "fb") return { limited: false, retryAfter: 0 };
    const day = await bump(`d:${hash}:${Math.floor(now / 86_400_000)}`);
    // The daily count resets at midnight UTC, so that is when a retry can work
    if (day > limits.perVisitorDay) return block("perVisitorDay", Math.ceil((86_400_000 - (now % 86_400_000)) / 1000));

    // Backstop against many IPs together running up the model bill. Counted after the per-IP checks,
    // so one IP spamming past its own limit cannot use up everyone else's share.
    if ((await bump(`g:${minuteNo}`)) > limits.globalMinute) return block("globalMinute", minuteLeft);
    return { limited: false, retryAfter: 0 };
  } catch (error) {
    console.error("Ask AI rate limit check failed:", error);
    // shortcut: per-process per-IP counter only (no global or daily cap), enough to cap cost during a DB outage
    const key = `${scope}:${ip}:${Math.floor(Date.now() / 60_000)}`;
    if (memory.size > 5000) memory.clear();
    const n = (memory.get(key) ?? 0) + 1;
    memory.set(key, n);
    return n > perMinute ? { limited: true, retryAfter: 60 } : { limited: false, retryAfter: 0 };
  }
}

// Sum and peak of the counters whose key starts with `prefix`; the anchored regex walks the _id index
async function counterStats(prefix: string, since: Date): Promise<{ sum: number; max: number }> {
  const col = (await getDocsDatabase()).collection<{ _id: string; n: number; createdAt: Date }>(COLLECTION);
  const [row] = await col
    .aggregate<{ sum: number; max: number }>([
      { $match: { _id: { $regex: `^${prefix}` }, createdAt: { $gte: since } } },
      { $group: { _id: null, sum: { $sum: "$n" }, max: { $max: "$n" } } },
    ])
    .toArray();
  return row ?? { sum: 0, max: 0 };
}

// Ask AI traffic over the last 24 hours, read from the same counters the limiter keeps (they expire after a day)
export async function getRateUsage(now = new Date()): Promise<RateUsage> {
  const since = new Date(now.getTime() - 86_400_000);
  // The counter each limit checks, by key prefix; the daily one only counts today's keys
  const counters: Record<LimitKey, string> = {
    perVisitorMinute: "ask:m:",
    perVisitorDay: `d:[0-9a-f]+:${Math.floor(now.getTime() / 86_400_000)}$`,
    globalMinute: "g:",
    ratingsPerVisitorMinute: "fb:m:",
  };
  const keys = Object.keys(counters) as LimitKey[];
  const [counts, blocks] = await Promise.all([
    Promise.all(keys.map((k) => counterStats(counters[k], since))),
    Promise.all(keys.map((k) => counterStats(`b:${k}:`, since))),
  ]);
  const byLimit = (pick: (i: number) => number) => Object.fromEntries(keys.map((k, i) => [k, pick(i)])) as Record<LimitKey, number>;
  const blocked = byLimit((i) => blocks[i].sum);
  return {
    // The overall counter also counts the questions its own cap then turned away, so those come off
    questions: counts[keys.indexOf("globalMinute")].sum - blocked.globalMinute,
    busiest: byLimit((i) => counts[i].max),
    blocked,
  };
}
