import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

// Logs out the admin by invalidating and expiring the auth-token cookie
export async function POST() {
  const response = NextResponse.json({ success: true });
  // Set empty cookie value with maxAge 0 to command browser to discard the session token
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
