import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, TokenPayload } from "./auth";
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

// Verifies JWT signature and checks tokenVersion against the MongoDB users collection
export async function validateSessionFromDb(token: string): Promise<TokenPayload | null> {
  const payload = await verifyJWT(token);
  if (!payload || typeof payload.tokenVersion !== "number" || !payload.userId || !payload.email) {
    return null;
  }

  if (!ObjectId.isValid(payload.userId)) {
    return null;
  }

  try {
    const client = await clientPromise;
    const db = client.db("codemate_blog");
    const user = await db.collection("users").findOne({ _id: new ObjectId(payload.userId) });

    if (!user) {
      return null;
    }

    const currentVersion = user.tokenVersion ?? 1;
    if (payload.tokenVersion !== currentVersion) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Database session validation error:", error);
    return null;
  }
}

// Strictly validates that the request Origin (or fallback Referer) matches the host header
function isAllowedOrigin(req: NextRequest): boolean {
  const host = req.headers.get("host");
  if (!host) return false;

  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const originUrl = new URL(origin);
      return originUrl.host.toLowerCase() === host.toLowerCase();
    } catch {
      return false;
    }
  }

  const referer = req.headers.get("referer");
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      return refererUrl.host.toLowerCase() === host.toLowerCase();
    } catch {
      return false;
    }
  }

  // Fail-closed: reject if neither Origin nor Referer is provided on mutating methods
  return false;
}

// Function signature for API route handlers that require an authenticated user session
type AuthenticatedHandler = (
  req: NextRequest,
  session: TokenPayload,
  context?: any
) => Promise<NextResponse> | Promise<Response>;

// Higher-order wrapper that validates Bearer authentication, token revocation, and CSRF before delegating
export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest, context?: any) => {
    // 1. Allow CORS OPTIONS preflight requests cleanly
    if (req.method.toUpperCase() === "OPTIONS") {
      return new NextResponse(null, { status: 204 });
    }

    // 2. Enforce fail-closed CSRF protection on mutating HTTP requests
    const mutatingMethods = ["POST", "PUT", "DELETE", "PATCH"];
    if (mutatingMethods.includes(req.method.toUpperCase())) {
      if (!isAllowedOrigin(req)) {
        return NextResponse.json(
          { detail: "Forbidden", error: "Forbidden: Invalid or missing CSRF origin" },
          { status: 403 }
        );
      }
    }

    // 3. Extract Bearer token from Authorization header using robust case-insensitive regex
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

    const token = match[1];

    // 4. Validate JWT signature, expiry, and tokenVersion against MongoDB
    const session = await validateSessionFromDb(token);
    if (!session) {
      return NextResponse.json(
        { detail: "Not authenticated", error: "Unauthorized: Invalid or expired token" },
        {
          status: 401,
          headers: { "WWW-Authenticate": "Bearer" },
        }
      );
    }

    // 5. Forward request with the verified user session payload to the protected handler
    return handler(req, session, context);
  };
}


