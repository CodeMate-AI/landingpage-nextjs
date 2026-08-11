import { loadEnvConfig } from "@next/env";
import path from "path";
loadEnvConfig(path.resolve(__dirname, ".."));

import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be configured in your env.");
    process.exit(1);
  }

  const { default: clientPromise } = await import("../src/lib/mongodb");
  const client = await clientPromise;
  const db = client.db("codemate_blog");

  // [MongoDB Collection: "users"] Check if admin user already exists
  const existing = await db.collection("users").findOne({ email });
  if (existing) {
    console.log("Admin account already seeded.");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // [MongoDB Collection: "users"] Insert initial admin account document
  await db.collection("users").insertOne({
    email,
    password: hashedPassword,
    name: "Ayush Singhal",
    createdAt: new Date(),
  });

  console.log(`Successfully seeded admin: ${email}. Please change password after first login.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
