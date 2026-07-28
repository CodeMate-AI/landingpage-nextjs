import clientPromise from "./mongodb";

export async function checkRateLimit(ip: string, email: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db("codemate_blog");

  const result = await db.collection("login_attempts").findOneAndUpdate(
    { ip, email },
    {
      $inc: { count: 1 },
      $setOnInsert: { firstAttempt: new Date() },
    },
    { upsert: true, returnDocument: "after" }
  );

  if (result && result.count > 5) {
    return false;
  }

  return true;
}

export async function resetRateLimit(ip: string, email: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db("codemate_blog");
  await db.collection("login_attempts").deleteOne({ ip, email });
}
