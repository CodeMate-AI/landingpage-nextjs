import { getDatabase } from "./mongodb";

const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15-minute sliding window
const MAX_FAILED_ATTEMPTS = 5;

// Pure check: Returns true if either the client IP or target email account are currently rate-limited
export async function isRateLimited(ip: string, email: string): Promise<boolean> {
  const db = await getDatabase();
  const normalizedEmail = email.toLowerCase().trim();
  const now = new Date();

  // Check both IP-level and account-level rate limits
  const attempts = await db
    .collection("login_attempts")
    .find({
      key: { $in: [`ip:${ip}`, `email:${normalizedEmail}`] },
    })
    .toArray();

  for (const attempt of attempts) {
    const elapsed = now.getTime() - new Date(attempt.firstAttempt).getTime();
    if (elapsed <= LOCKOUT_DURATION_MS && attempt.count >= MAX_FAILED_ATTEMPTS) {
      return true;
    }
  }

  // Also check legacy documents if any exist during migration
  const legacyAttempt = await db.collection("login_attempts").findOne({ ip, email: normalizedEmail });
  if (legacyAttempt) {
    const elapsed = now.getTime() - new Date(legacyAttempt.firstAttempt).getTime();
    if (elapsed <= LOCKOUT_DURATION_MS && legacyAttempt.count >= MAX_FAILED_ATTEMPTS) {
      return true;
    }
  }

  return false;
}

// Records a failed login attempt against both the client IP and the targeted email account atomically
export async function recordFailedAttempt(ip: string, email: string): Promise<void> {
  const db = await getDatabase();
  const normalizedEmail = email.toLowerCase().trim();
  const now = new Date();
  const windowStart = new Date(now.getTime() - LOCKOUT_DURATION_MS);

  const keys = [`ip:${ip}`, `email:${normalizedEmail}`];

  for (const key of keys) {
    // Try atomic increment if an active window attempt exists
    const updateResult = await db.collection("login_attempts").updateOne(
      { key, firstAttempt: { $gte: windowStart } },
      { $inc: { count: 1 } }
    );

    // If no active window attempt exists, set a new window atomically via upsert
    if (updateResult.matchedCount === 0) {
      await db.collection("login_attempts").updateOne(
        { key },
        { $set: { count: 1, firstAttempt: now } },
        { upsert: true }
      );
    }
  }
}

// Clears recorded login attempts for this IP and email upon successful authentication
export async function resetRateLimit(ip: string, email: string): Promise<void> {
  const db = await getDatabase();
  const normalizedEmail = email.toLowerCase().trim();

  await db.collection("login_attempts").deleteMany({
    $or: [
      { key: { $in: [`ip:${ip}`, `email:${normalizedEmail}`] } },
      { ip, email: normalizedEmail },
    ],
  });
}
