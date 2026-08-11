import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT, COOKIE_NAME } from "./lib/auth";

// Next.js Edge Middleware guarding all admin routes against unauthenticated access
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Intercept all /admin routes while keeping /admin/login publicly accessible
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // 1. Retrieve the auth-token session cookie
    const cookie = req.cookies.get(COOKIE_NAME);

    // 2. If cookie is missing, redirect user to login page immediately
    if (!cookie) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // 3. Verify JWT signature and token validity
    const payload = await verifyJWT(cookie.value);
    if (!payload) {
      // If token is invalid or expired, redirect to login and clear corrupted cookie
      const res = NextResponse.redirect(new URL("/admin/login", req.url));
      res.cookies.delete(COOKIE_NAME);
      return res;
    }
  }

  // Allow authenticated request to proceed to the destination page
  return NextResponse.next();
}

// Scopes this middleware specifically to the /admin route hierarchy
export const config = {
  matcher: ["/admin/:path*"],
};
