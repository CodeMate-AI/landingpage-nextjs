import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { signJWT, SESSION_DURATION, COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rateLimit";
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
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // 2. Enforce MongoDB-backed sliding-window rate limit (max 5 attempts per 15 min)
    const allowed = await checkRateLimit(ip, email);
    if (!allowed) {
      return NextResponse.json({ error: "Too many login attempts. Locked for 15m." }, { status: 429 });
    }

    // 3. Connect to database and retrieve user record by email
    const client = await clientPromise;
    const db = client.db("codemate_blog");
    // [MongoDB Collection: "users"] Query administrator document by email
    const user = await db.collection("users").findOne({ email });

    // 4. Verify password hash using bcryptjs
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Invalid email or password combination" }, { status: 401 });
    }

    // 5. Successful login: reset failed login attempt counter for this IP/email
    await resetRateLimit(ip, email);

    // 6. Sign stateless JWT token containing user identity
    const token = await signJWT({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    // 7. Attach signed JWT in a secure, HTTP-only cookie with 7-day expiration
    const response = NextResponse.json({ success: true });
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
