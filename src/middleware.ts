import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT, COOKIE_NAME } from "./lib/auth";

// Next.js Edge Middleware guarding admin pages and API endpoints
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  // 1. Allow CORS OPTIONS preflight requests cleanly
  if (req.method.toUpperCase() === "OPTIONS") {
    return new NextResponse(null, { status: 204 });
  }

  // 2. Guard administrative page routes (/admin/*)
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

  // 3. Guard administrative API routes (/api/admin/*), allowing /api/admin/login
  if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/login") {
    const authHeader = req.headers.get("authorization");
    const match = authHeader?.match(/^Bearer +(\S+)$/i);

    if (!match) {
      return NextResponse.json(
        { detail: "Not authenticated", error: "Unauthorized: Missing or malformed Authorization header" },
        {
          status: 401,
          headers: { "WWW-Authenticate": "Bearer" },
        }
      );
    }

    const payload = await verifyJWT(match[1]);
    if (!payload) {
      return NextResponse.json(
        { detail: "Not authenticated", error: "Unauthorized: Invalid or expired token" },
        {
          status: 401,
          headers: { "WWW-Authenticate": "Bearer" },
        }
      );
    }
  }

  // Forward request with injected x-pathname header
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Scopes this middleware specifically to admin pages and admin API endpoints
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};


