import clientPromise from "./mongodb";

// Checks whether the combination of client IP and email has exceeded allowed login attempts
export async function checkRateLimit(ip: string, email: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db("codemate_blog");

  // Query existing attempt record for this IP and email pair
  const attempt = await db.collection("login_attempts").findOne({ ip, email });
  const now = new Date();
  const lockoutDurationMs = 15 * 60 * 1000; // 15-minute sliding window

  if (attempt) {
    const elapsed = now.getTime() - new Date(attempt.firstAttempt).getTime();

    if (elapsed > lockoutDurationMs) {
      // 15-minute window expired: reset counter to 1 and restart the window timer
      await db.collection("login_attempts").updateOne(
        { ip, email },
        { $set: { count: 1, firstAttempt: now } }
      );
      return true;
    } else {
      // Within the 15-minute window: atomically increment the attempt count
      const updated = await db.collection("login_attempts").findOneAndUpdate(
        { ip, email },
        { $inc: { count: 1 } },
        { returnDocument: "after" }
      );
      
      // Block request if consecutive failed attempts exceed threshold of 5
      if (updated && updated.count > 5) {
        return false;
      }
    }
  } else {
    // First failed attempt: insert initial attempt document
    await db.collection("login_attempts").insertOne({
      ip,
      email,
      count: 1,
      firstAttempt: now,
    });
  }

  return true;
}

// Clears recorded login attempts for this IP and email upon successful authentication
export async function resetRateLimit(ip: string, email: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db("codemate_blog");
  await db.collection("login_attempts").deleteOne({ ip, email });
}
