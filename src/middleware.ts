import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/auth";

// Next.js Edge Middleware guarding administrative API endpoints with Bearer tokens and forwarding page navigation
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  // 1. Allow CORS OPTIONS preflight requests cleanly
  if (req.method.toUpperCase() === "OPTIONS") {
    return new NextResponse(null, { status: 204 });
  }

  // 2. Guard administrative API routes (/api/admin/*), allowing /api/admin/login
  if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/login") {
    const authHeader = req.headers.get("authorization");
    const match = authHeader?.match(/^Bearer +(\S+)$/i);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json(
        { detail: "Not authenticated", error: "Unauthorized: Missing Bearer authentication credentials" },
        {
          status: 401,
          headers: { "WWW-Authenticate": "Bearer" },
        }
      );
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        { detail: "Not authenticated", error: "Unauthorized: Invalid or expired Bearer token" },
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


