import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

export interface SessionPayload {
  email: string;
  name?: string;
  avatar?: string;
  role: "owner" | "admin";
}

function getAuthSecret(): Uint8Array {
  const secret =
    process.env.AUTH_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "slovlog-secure-jwt-default-secret-key-32chars";
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const secret = getAuthSecret();
  return new SignJWT({
    sub: payload.email,
    email: payload.email,
    name: payload.name || "",
    avatar: payload.avatar || "",
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const secret = getAuthSecret();
    const { payload } = await jwtVerify(token, secret);
    if (!payload.email || typeof payload.email !== "string") {
      return null;
    }
    return {
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : undefined,
      avatar: typeof payload.avatar === "string" ? payload.avatar : undefined,
      role: (payload.role as "owner" | "admin") || "admin",
    };
  } catch {
    return null;
  }
}
