import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getUserFromRequest } from "@/lib/auth/middleware";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { revokeAllSessionsForUser } from "@/lib/auth/session";

const MIN_PASSWORD_LENGTH = 6;

export async function POST(req: Request) {
  try {
    const auth = await getUserFromRequest(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or empty JSON body" },
        { status: 400 },
      );
    }

    const { oldPassword, newPassword, confirmPassword } = body ?? {};

    if (
      typeof oldPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string" ||
      !oldPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return NextResponse.json(
        { success: false, message: "All password fields are required" },
        { status: 400 },
      );
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters`,
        },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password and confirmation do not match",
        },
        { status: 400 },
      );
    }

    if (newPassword === oldPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must differ from current password",
        },
        { status: 400 },
      );
    }

    const [user] = await db
      .select({
        id: users.id,
        passwordHash: users.passwordHash,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.id, auth.userId))
      .limit(1);

    if (!user || !user.isActive || !user.passwordHash) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const oldPasswordValid = await verifyPassword(oldPassword, user.passwordHash);
    if (!oldPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 },
      );
    }

    const newHash = await hashPassword(newPassword);

    await db.transaction(async (tx) => {
      // set_config(...) is the parameter-safe equivalent of SET LOCAL.
      // SET LOCAL itself doesn't accept bind parameters, which Drizzle's
      // sql`...${value}` template requires.
      await tx.execute(
        sql`SELECT set_config('app.current_user_id', ${user.id}, true)`,
      );
      await tx.execute(
        sql`SELECT set_config('app.actor_type', 'user', true)`,
      );
      await tx
        .update(users)
        .set({ passwordHash: newHash })
        .where(eq(users.id, user.id));
    });

    // Per the chosen policy: revoke all sessions including current. The user
    // will have to sign in again with the new password on every device.
    await revokeAllSessionsForUser(user.id);

    return NextResponse.json({
      success: true,
      message: "Password changed. Please sign in again.",
    });
  } catch (e) {
    console.error("[auth/change-password]", e);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
