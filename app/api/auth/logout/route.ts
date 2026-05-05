import { NextResponse } from "next/server";
import { hashJti, verifyRefreshToken } from "@/lib/auth/jwt";
import { findActiveSession, revokeSession } from "@/lib/auth/session";

// Logout always returns 200. From the user's perspective the session is
// over the moment they click logout — the client clears its tokens
// immediately. Server-side revocation is best-effort: if the refresh token
// is missing/invalid we still return success rather than leaking info
// about token validity.
export async function POST(req: Request) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: true, message: "Logged out" });
    }

    const refreshToken =
      body && typeof body === "object" && "refreshToken" in body
        ? (body as { refreshToken?: unknown }).refreshToken
        : undefined;

    if (!refreshToken || typeof refreshToken !== "string") {
      return NextResponse.json({ success: true, message: "Logged out" });
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json({ success: true, message: "Logged out" });
    }

    const session = await findActiveSession(hashJti(payload.jti));
    if (session) {
      await revokeSession(session.id);
    }

    return NextResponse.json({ success: true, message: "Logged out" });
  } catch (e) {
    console.error("[auth/logout]", e);
    return NextResponse.json({ success: true, message: "Logged out" });
  }
}
