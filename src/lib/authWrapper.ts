import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, COOKIE_NAME, TokenPayload } from "./auth";

type AuthenticatedHandler = (
  req: NextRequest,
  session: TokenPayload,
  context?: any
) => Promise<NextResponse> | Promise<Response>;

export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest, context?: any) => {
    const cookie = req.cookies.get(COOKIE_NAME);
    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized: Missing Session" }, { status: 401 });
    }

    const session = await verifyJWT(cookie.value);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Invalid Session" }, { status: 401 });
    }

    return handler(req, session, context);
  };
}
