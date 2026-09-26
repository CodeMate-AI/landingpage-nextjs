import { NextRequest, NextResponse } from "next/server";
import { TokenPayload } from "@/lib/auth";
import { withAuth } from "@/lib/authWrapper";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Logs out the admin by invalidating tokenVersion in MongoDB to revoke all active JWT sessions
async function logoutHandler(req: NextRequest, session: TokenPayload) {
  try {
    if (session?.userId && ObjectId.isValid(session.userId)) {
      const db = await getDatabase();
      // Increment tokenVersion to invalidate all existing issued JWT tokens for this user
      await db.collection("users").updateOne(
        { _id: new ObjectId(session.userId) },
        { $inc: { tokenVersion: 1 } }
      );
    }
  } catch (err) {
    console.error("Failed to increment tokenVersion on logout:", err);
  }

  return NextResponse.json({ success: true });
}

export const POST = withAuth(logoutHandler);

