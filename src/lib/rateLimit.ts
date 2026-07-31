import clientPromise from "./mongodb";

export async function checkRateLimit(ip: string, email: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db("codemate_blog");

  const attempt = await db.collection("login_attempts").findOne({ ip, email });
  const now = new Date();
  const lockoutDurationMs = 15 * 60 * 1000; // 15 minutes

  if (attempt) {
    const elapsed = now.getTime() - new Date(attempt.firstAttempt).getTime();

    if (elapsed > lockoutDurationMs) {
      // The 15-minute window expired — reset the count and window starting time
      await db.collection("login_attempts").updateOne(
        { ip, email },
        { $set: { count: 1, firstAttempt: now } }
      );
      return true;
    } else {
      // We are within the 15-minute window — increment count
      const updated = await db.collection("login_attempts").findOneAndUpdate(
        { ip, email },
        { $inc: { count: 1 } },
        { returnDocument: "after" }
      );
      
      if (updated && updated.count > 5) {
        return false;
      }
    }
  } else {
    // No prior attempts — create the record
    await db.collection("login_attempts").insertOne({
      ip,
      email,
      count: 1,
      firstAttempt: now,
    });
  }

  return true;
}

export async function resetRateLimit(ip: string, email: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db("codemate_blog");
  await db.collection("login_attempts").deleteOne({ ip, email });
}
