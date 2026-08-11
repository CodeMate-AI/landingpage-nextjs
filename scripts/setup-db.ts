import { loadEnvConfig } from "@next/env";
import path from "path";
loadEnvConfig(path.resolve(__dirname, ".."));

async function main() {
  const { default: clientPromise } = await import("../src/lib/mongodb");
  const client = await clientPromise;
  const db = client.db("codemate_blog");

  console.log("Setting up collections and indexes...");

  // [MongoDB Collection: "blogs"] Unique index on slug + compound index on publication status and date
  await db.collection("blogs").createIndex({ slug: 1 }, { unique: true });
  await db.collection("blogs").createIndex({ published: 1, publishedAt: -1 });

  // [MongoDB Collection: "users"] Unique index on admin email address
  await db.collection("users").createIndex({ email: 1 }, { unique: true });

  // [MongoDB Collection: "login_attempts"] Composite index on IP/email + TTL auto-expiry index (15 min)
  await db.collection("login_attempts").createIndex({ ip: 1, email: 1 });
  await db.collection("login_attempts").createIndex({ firstAttempt: 1 }, { expireAfterSeconds: 900 });

  console.log("Database index initialization finished successfully.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Index creation failed:", err);
  process.exit(1);
});
