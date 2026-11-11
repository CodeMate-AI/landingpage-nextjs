import { createHash } from "crypto";
import { getDatabase } from "./mongodb";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_SUBMISSIONS = 5;
const CHECK_TIMEOUT_MS = 2000;
const COLLECTION = "trial_submission_attempts";
const RECORD_TTL_SECONDS = 24 * 60 * 60;

type RateLimitResult = { isLimited: boolean; retryAfter: number };
type Database = Awaited<ReturnType<typeof getDatabase>>;

const NOT_LIMITED: RateLimitResult = { isLimited: false, retryAfter: 0 };

let indexesReady: Promise<void> | undefined;

// Runs once per server process, and again after a failure. Creating an index that already exists does nothing.
function ensureIndexes(db: Database): Promise<void> {
  indexesReady ??= (async () => {
    const attempts = db.collection(COLLECTION);
    // The unique index is what keeps one record per IP when parallel requests arrive.
    await attempts.createIndex({ key: 1 }, { unique: true });
    // Deletes old records, so the collection doesn't grow forever.
    await attempts.createIndex({ windowStart: 1 }, { expireAfterSeconds: RECORD_TTL_SECONDS });
  })().catch((error: unknown) => {
    indexesReady = undefined;
    throw error;
  });

  return indexesReady;
}

async function countSubmission(ip: string): Promise<RateLimitResult> {
  const db = await getDatabase();
  // Counting without the unique index could create duplicates, and those would stop the index from being built.
  await ensureIndexes(db);

  const now = new Date();
  const windowExpired = { $lt: [{ $ifNull: ["$windowStart", new Date(0)] }, new Date(now.getTime() - WINDOW_MS)] };
  // Stores a hash so the collection doesn't hold visitors' IP addresses.
  const key = createHash("sha256").update(ip).digest("hex");

  // One atomic update on the uniquely indexed key, so parallel requests can't slip past the count.
  const record = await db.collection(COLLECTION).findOneAndUpdate(
    { key },
    [
      {
        $set: {
          count: { $cond: [windowExpired, 1, { $add: ["$count", 1] }] },
          windowStart: { $cond: [windowExpired, now, "$windowStart"] },
        },
      },
    ],
    { upsert: true, returnDocument: "after" },
  );

  if (!record || record.count <= MAX_SUBMISSIONS) return NOT_LIMITED;

  const elapsed = now.getTime() - new Date(record.windowStart).getTime();
  return { isLimited: true, retryAfter: Math.max(1, Math.ceil((WINDOW_MS - elapsed) / 1000)) };
}

// An internal address means a proxy didn't forward the visitor's IP.
function isInternalAddress(ip: string): boolean {
  const address = ip.replace(/^::ffff:/i, "");
  return /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1$|f[cd]|fe80:)/i.test(address);
}

// Counts a trial submission for this IP. A database problem never blocks a real lead:
// the check gives up after a short wait and lets the submission through.
export async function checkTrialRateLimit(ip: string | null): Promise<RateLimitResult> {
  // Without a real visitor IP, everyone would share one counter and real leads would get blocked.
  if (!ip || isInternalAddress(ip)) return NOT_LIMITED;

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<RateLimitResult>((resolve) => {
    timer = setTimeout(() => {
      console.warn("Trial rate limit check timed out; allowing the submission.");
      resolve(NOT_LIMITED);
    }, CHECK_TIMEOUT_MS);
  });

  const check = countSubmission(ip).catch((error: unknown) => {
    console.warn("Trial rate limit check failed; allowing the submission:", error);
    return NOT_LIMITED;
  });

  try {
    return await Promise.race([check, timeout]);
  } finally {
    clearTimeout(timer);
  }
}
