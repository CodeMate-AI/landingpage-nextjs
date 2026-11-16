import { createHash } from "crypto";
import { getDocsDatabase } from "@/lib/mongodb";

const COLLECTION = "ask_rate";
const DAY_LIMIT = 100;

let indexReady: Promise<unknown> | undefined;

// The first X-Forwarded-For entry is whatever the client sent, so it can be faked to dodge the limit.
// Prefer headers the proxy sets itself (Netlify, nginx), then the LAST forwarded entry, which the
// nearest proxy appended. shortcut: if a CDN sits in front of nginx, use its client-IP header instead.
export function clientIp(req: Request) {
  const h = req.headers;
  const forwarded = h.get("x-forwarded-for")?.split(",").map((s) => s.trim()).filter(Boolean);
  return h.get("x-nf-client-connection-ip") || h.get("x-real-ip") || forwarded?.at(-1) || "anonymous";
}

// Counts requests per IP per minute and per day in MongoDB, so every server process shares the count.
// Only a hash of the IP is stored, and records delete themselves after a day.
// Fails open on a database error: a broken limiter should not take Ask AI down.
// `scope` keeps counters apart (questions vs feedback); only the "ask" scope has the overall cap.
export async function checkRate(ip: string, scope: "ask" | "fb" = "ask"): Promise<{ limited: boolean; retryAfter: number }> {
  const perMinute = scope === "fb" ? 30 : Number(process.env.DOCS_AI_RATE_LIMIT_PER_MINUTE ?? 10);
  if (!Number.isFinite(perMinute) || perMinute <= 0) return { limited: false, retryAfter: 0 };
  try {
    const col = (await getDocsDatabase()).collection<{ _id: string; n: number; createdAt: Date }>(COLLECTION);
    indexReady ??= col.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 }).catch((e) => {
      indexReady = undefined;
      throw e;
    });
    await indexReady;

    const hash = createHash("sha256").update(ip).digest("hex").slice(0, 32);
    const now = Date.now();
    const bump = async (key: string) => {
      const doc = await col.findOneAndUpdate(
        { _id: key },
        { $inc: { n: 1 }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true, returnDocument: "after" }
      );
      return doc?.n ?? 1;
    };
    const minuteLeft = 60 - Math.floor((now % 60_000) / 1000);
    const minute = await bump(`${scope}:m:${hash}:${Math.floor(now / 60_000)}`);
    if (minute > perMinute) return { limited: true, retryAfter: minuteLeft };
    if (scope === "fb") return { limited: false, retryAfter: 0 };
    const day = await bump(`d:${hash}:${Math.floor(now / 86_400_000)}`);
    if (day > DAY_LIMIT) return { limited: true, retryAfter: 3600 };
    
    // Backstop against many IPs together running up the model bill. Counted after the per-IP checks,
    // so one IP spamming past its own limit cannot use up everyone else's share.
    const globalPerMinute = Number(process.env.DOCS_AI_GLOBAL_PER_MINUTE ?? 60);
    if (Number.isFinite(globalPerMinute) && globalPerMinute > 0 && (await bump(`g:${Math.floor(now / 60_000)}`)) > globalPerMinute) {
      return { limited: true, retryAfter: minuteLeft };
    }
    return { limited: false, retryAfter: 0 };
  } catch (error) {
    console.error("Ask AI rate limit check failed:", error);
    return { limited: false, retryAfter: 0 };
  }
}
