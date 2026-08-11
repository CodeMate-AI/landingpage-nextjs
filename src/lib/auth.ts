import { SignJWT, jwtVerify } from "jose";

// Encode JWT signing secret from environment with a secure default fallback
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-at-least-32-chars-long"
);

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
    .sign(JWT_SECRET);
}

// Verifies the incoming JWT signature against the secret and extracts payload
export async function verifyJWT(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    // Return null if token is expired, corrupted, or tampered with
    return null;
  }
}
