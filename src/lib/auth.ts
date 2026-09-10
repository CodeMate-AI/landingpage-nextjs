import { SignJWT, jwtVerify } from "jose";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("FATAL: JWT_SECRET environment variable is missing in production environment.");
    }
    return new TextEncoder().encode("dev-only-insecure-secret-key-replace-in-production-min-32-chars");
  }
  return new TextEncoder().encode(secret);
}

// Admin session duration: 7 days expressed in seconds
export const SESSION_DURATION = 60 * 60 * 24 * 7;

// Name of the HTTP-only cookie storing the admin JWT token
export const COOKIE_NAME = "auth-token";

// Structure of user identity data stored inside the signed JWT payload
export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
}

// Signs a new stateless JWT with HS256 algorithm and 7-day expiration
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
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as TokenPayload;
  } catch {
    // Return null if token is expired, corrupted, or tampered with
    return null;
  }
}
