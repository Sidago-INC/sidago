import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken, hashJti } from "@/lib/auth/jwt";
import { createSession } from "@/lib/auth/session";
import { getUserRole } from "@/lib/auth/role";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;
const GENERIC_AUTH_FAILURE = "Credentials not matched";

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

    const { email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 },
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, message: GENERIC_AUTH_FAILURE },
        { status: 401 },
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: "Account is inactive" },
        { status: 401 },
      );
    }

    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const minutesLeft = Math.max(
        1,
        Math.ceil(
          (new Date(user.lockedUntil).getTime() - Date.now()) / 60000,
        ),
      );
      return NextResponse.json(
        {
          success: false,
          message: `Account temporarily locked. Try again in ${minutesLeft} minute(s).`,
        },
        { status: 401 },
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);

    if (!valid) {
      const newCount = (user.failedLoginCount ?? 0) + 1;
      const lockedUntil =
        newCount >= MAX_FAILED_ATTEMPTS
          ? new Date(
              Date.now() + LOCK_DURATION_MINUTES * 60 * 1000,
            ).toISOString()
          : user.lockedUntil ?? null;

      await db.transaction(async (tx) => {
        await tx.execute(sql`SET LOCAL app.actor_type = 'system'`);
        await tx
          .update(users)
          .set({ failedLoginCount: newCount, lockedUntil })
          .where(eq(users.id, user.id));
      });

      return NextResponse.json(
        { success: false, message: GENERIC_AUTH_FAILURE },
        { status: 401 },
      );
    }

    await db.transaction(async (tx) => {
      await tx.execute(sql`SET LOCAL app.actor_type = 'system'`);
      await tx
        .update(users)
        .set({
          failedLoginCount: 0,
          lockedUntil: null,
          lastLoginAt: new Date().toISOString(),
        })
        .where(eq(users.id, user.id));
    });

    const role = await getUserRole(user.id);

    const userAgent = req.headers.get("user-agent") ?? null;
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

    const accessToken = await signAccessToken({
      userId: user.id,
      email: user.email,
      role,
    });
    const { token: refreshToken, jti } = await signRefreshToken({
      userId: user.id,
    });

    await createSession({
      userId: user.id,
      refreshTokenHash: hashJti(jti),
      userAgent,
      ipAddress,
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name:
          user.fullName ??
          `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        email: user.email,
        role,
      },
    });
  } catch (e) {
    console.error("[auth/login]", e);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
