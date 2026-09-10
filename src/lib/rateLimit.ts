import clientPromise from "./mongodb";

const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15-minute sliding window
const MAX_FAILED_ATTEMPTS = 5;

// Pure check: Returns true if the client IP and email are currently rate-limited (locked out)
export async function isRateLimited(ip: string, email: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db("codemate_blog");

  const attempt = await db.collection("login_attempts").findOne({ ip, email });
  if (!attempt) return false;

  const now = new Date();
  const elapsed = now.getTime() - new Date(attempt.firstAttempt).getTime();

  if (elapsed > LOCKOUT_DURATION_MS) {
    // Window has expired, not locked out anymore
    return false;
  }

  return attempt.count >= MAX_FAILED_ATTEMPTS;
}

// Records a failed login attempt for the given IP and email
export async function recordFailedAttempt(ip: string, email: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db("codemate_blog");
  const now = new Date();

  const attempt = await db.collection("login_attempts").findOne({ ip, email });

  if (attempt) {
    const elapsed = now.getTime() - new Date(attempt.firstAttempt).getTime();
    if (elapsed > LOCKOUT_DURATION_MS) {
      // 15-minute window expired: reset counter to 1 and restart the window timer
      await db.collection("login_attempts").updateOne(
        { ip, email },
        { $set: { count: 1, firstAttempt: now } }
      );
    } else {
      // Within window: increment failed attempt counter
      await db.collection("login_attempts").updateOne(
        { ip, email },
        { $inc: { count: 1 } }
      );
    }
  } else {
    // First failed attempt: insert initial document
    await db.collection("login_attempts").insertOne({
      ip,
      email,
      count: 1,
      firstAttempt: now,
    });
  }
}

// Clears recorded login attempts for this IP and email upon successful authentication
export async function resetRateLimit(ip: string, email: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db("codemate_blog");
  await db.collection("login_attempts").deleteOne({ ip, email });
}
