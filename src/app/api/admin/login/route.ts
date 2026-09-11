import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { signJWT, SESSION_DURATION, COOKIE_NAME } from "@/lib/auth";
import { isRateLimited, recordFailedAttempt, resetRateLimit } from "@/lib/rateLimit";
import { LoginSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

// Authenticates admin credentials, checks brute-force limits, and issues an HTTP-only JWT session cookie
export async function POST(req: NextRequest) {
  try {
    // 1. Parse JSON body and validate email and password constraints via Zod
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { email, password } = parsed.data;
    // Extract genuine client IP behind reverse proxies/CDNs
    const rawForwarded = req.headers.get("x-forwarded-for");
    const ip =
      (rawForwarded ? rawForwarded.split(",")[0]?.trim() : null) ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 2. Enforce MongoDB-backed sliding-window rate limit (max 5 attempts per 15 min)
    const locked = await isRateLimited(ip, email);
    if (locked) {
      return NextResponse.json({ error: "Too many login attempts. Locked for 15m." }, { status: 429 });
    }

    // 3. Connect to database and retrieve user record by email
    const client = await clientPromise;
    const db = client.db("codemate_blog");
    // [MongoDB Collection: "users"] Query administrator document by email
    const user = await db.collection("users").findOne({ email });

    // 4. Verify password hash using bcryptjs
    if (!user || !(await bcrypt.compare(password, user.password))) {
      await recordFailedAttempt(ip, email);
      return NextResponse.json({ error: "Invalid email or password combination" }, { status: 401 });
    }

    // 5. Successful login: reset failed login attempt counter for this IP/email
    await resetRateLimit(ip, email);

    // 6. Ensure tokenVersion exists persistently in the database
    let tokenVersion = user.tokenVersion;
    if (typeof tokenVersion !== "number") {
      tokenVersion = 1;
      await db.collection("users").updateOne(
        { _id: user._id },
        { $set: { tokenVersion: 1 } }
      );
    }

    // 7. Sign stateless JWT token containing user identity and current tokenVersion
    const token = await signJWT({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      tokenVersion,
    });

    // 8. Attach signed JWT in a secure, HTTP-only cookie and return token string in JSON
    const response = NextResponse.json({ success: true, token });
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

