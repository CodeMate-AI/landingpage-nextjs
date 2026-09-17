import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, TokenPayload } from "@/lib/auth";
import { withAuth } from "@/lib/authWrapper";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Logs out the admin by invalidating tokenVersion in MongoDB and expiring the auth-token cookie
async function logoutHandler(req: NextRequest, session: TokenPayload) {
  try {
    if (session?.userId && ObjectId.isValid(session.userId)) {
      const client = await clientPromise;
      const db = client.db("codemate_blog");
      // Increment tokenVersion to invalidate all existing issued JWT tokens for this user
      await db.collection("users").updateOne(
        { _id: new ObjectId(session.userId) },
        { $inc: { tokenVersion: 1 } }
      );
    }
  } catch (err) {
    console.error("Failed to increment tokenVersion on logout:", err);
  }

  const response = NextResponse.json({ success: true });
  // Set empty cookie value with maxAge 0 to command browser to discard the session token
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}

export const POST = withAuth(logoutHandler);

