import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-at-least-32-chars-long"
);

export const SESSION_DURATION = 60 * 60 * 24 * 7;
export const COOKIE_NAME = "auth-token";

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
}

export async function signJWT(payload: TokenPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}
