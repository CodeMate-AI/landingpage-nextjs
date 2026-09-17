import { SignJWT, jwtVerify } from "jose";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length < 32) {
    throw new Error(
      "FATAL: JWT_SECRET environment variable is missing or shorter than 32 characters. A cryptographically secure secret is required."
    );
  }
  return new TextEncoder().encode(secret.trim());
}

// Admin session duration: 24 hours expressed in seconds
export const SESSION_DURATION = 60 * 60 * 24;

// Name of the HTTP-only cookie storing the admin JWT token
export const COOKIE_NAME = "auth-token";

// Structure of user identity data stored inside the signed JWT payload
export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  tokenVersion: number;
}

// Signs a new stateless JWT with HS256 algorithm and 24-hour expiration
export async function signJWT(payload: TokenPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getJwtSecret());
}

// Verifies the incoming JWT signature against the secret and extracts payload
export async function verifyJWT(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });

    if (
      typeof (payload as any).tokenVersion !== "number" ||
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      !payload.userId ||
      !payload.email
    ) {
      return null;
    }

    return payload as unknown as TokenPayload;
  } catch {
    // Return null if token is expired, corrupted, or tampered with
    return null;
  }
}

