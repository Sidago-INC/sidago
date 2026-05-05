import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashJti, signAccessToken, verifyRefreshToken } from "@/lib/auth/jwt";
import { findActiveSession } from "@/lib/auth/session";
import { getUserRole } from "@/lib/auth/role";

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or empty JSON body" },
        { status: 400 },
      );
    }

    const { refreshToken } = body ?? {};

    if (!refreshToken || typeof refreshToken !== "string") {
      return NextResponse.json(
        { success: false, message: "Refresh token is required" },
        { status: 400 },
      );
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid refresh token" },
        { status: 401 },
      );
    }

    const session = await findActiveSession(hashJti(payload.jti));
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Invalid refresh token" },
        { status: 401 },
      );
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: "Invalid refresh token" },
        { status: 401 },
      );
    }

    const role = await getUserRole(user.id);

    const accessToken = await signAccessToken({
      userId: user.id,
      email: user.email,
      role,
    });

    return NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
    });
  } catch (e) {
    console.error("[auth/refresh]", e);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
