import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT, COOKIE_NAME } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Guard /admin routes, excluding the login page itself
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const cookie = req.cookies.get(COOKIE_NAME);

    if (!cookie) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    const payload = await verifyJWT(cookie.value);
    if (!payload) {
      const res = NextResponse.redirect(new URL("/admin/login", req.url));
      res.cookies.delete(COOKIE_NAME);
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
