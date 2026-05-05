import { verifyAccessToken } from "./jwt";
import type { AuthenticatedUser } from "./types";

export async function getUserFromRequest(
  req: Request,
): Promise<AuthenticatedUser | null> {
  const header =
    req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (!header) return null;

  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  const payload = await verifyAccessToken(match[1].trim());
  if (!payload) return null;

  return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}
