import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";
import type { AccessTokenPayload, RefreshTokenPayload } from "./types";

const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";
const ALG = "HS256";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function signAccessToken(input: {
  userId: string;
  email: string;
  role: string;
}): Promise<string> {
  return new SignJWT({
    email: input.email,
    role: input.role,
    type: "access",
  })
    .setProtectedHeader({ alg: ALG })
    .setSubject(input.userId)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TTL)
    .sign(getSecret());
}

export async function verifyAccessToken(
  token: string,
): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      payload.type !== "access" ||
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      type: "access",
    };
  } catch {
    return null;
  }
}

export async function signRefreshToken(input: {
  userId: string;
}): Promise<{ token: string; jti: string }> {
  const jti = crypto.randomUUID();
  const token = await new SignJWT({ type: "refresh" })
    .setProtectedHeader({ alg: ALG })
    .setSubject(input.userId)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(REFRESH_TTL)
    .sign(getSecret());
  return { token, jti };
}

export async function verifyRefreshToken(
  token: string,
): Promise<RefreshTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      payload.type !== "refresh" ||
      typeof payload.sub !== "string" ||
      typeof payload.jti !== "string"
    ) {
      return null;
    }
    return {
      sub: payload.sub,
      jti: payload.jti,
      type: "refresh",
    };
  } catch {
    return null;
  }
}

export function hashJti(jti: string): string {
  return crypto.createHash("sha256").update(jti).digest("hex");
}
