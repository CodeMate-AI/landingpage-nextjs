import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { signJWT, SESSION_DURATION, COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rateLimit";
import { LoginSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    const allowed = await checkRateLimit(ip, email);
    if (!allowed) {
      return NextResponse.json({ error: "Too many login attempts. Locked for 15m." }, { status: 429 });
    }

    const client = await clientPromise;
    const db = client.db("codemate_blog");
    const user = await db.collection("users").findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Invalid email or password combination" }, { status: 401 });
    }

    await resetRateLimit(ip, email);

    const token = await signJWT({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

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
