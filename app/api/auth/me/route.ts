import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getUserFromRequest } from "@/lib/auth/middleware";

export async function GET(req: Request) {
  try {
    const auth = await getUserFromRequest(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        fullName: users.fullName,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.id, auth.userId))
      .limit(1);

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name:
          user.fullName ??
          `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        email: user.email,
        role: auth.role,
      },
    });
  } catch (e) {
    console.error("[auth/me]", e);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
