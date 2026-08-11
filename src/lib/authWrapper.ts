import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, COOKIE_NAME, TokenPayload } from "./auth";

// Function signature for API route handlers that require an authenticated user session
type AuthenticatedHandler = (
  req: NextRequest,
  session: TokenPayload,
  context?: any
) => Promise<NextResponse> | Promise<Response>;

// Higher-order wrapper that validates the auth cookie before delegating to the handler
export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest, context?: any) => {
    // 1. Check for presence of the auth-token cookie in the incoming request
    const cookie = req.cookies.get(COOKIE_NAME);
    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized: Missing Session" }, { status: 401 });
    }

    // 2. Validate JWT signature and expiration; reject with 401 if invalid
    const session = await verifyJWT(cookie.value);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Invalid Session" }, { status: 401 });
    }

    // 3. Forward request with the verified user session payload to the protected handler
    return handler(req, session, context);
  };
}
