import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
