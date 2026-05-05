import { db } from "@/lib/db";
import { userSessions } from "@/lib/db/schema";
import { and, eq, gt, isNull, sql } from "drizzle-orm";

const REFRESH_TTL_DAYS = 7;

export async function createSession(input: {
  userId: string;
  refreshTokenHash: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}): Promise<{ sessionId: string }> {
  const expiresAt = new Date(
    Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const [row] = await db
    .insert(userSessions)
    .values({
      userId: input.userId,
      refreshTokenHash: input.refreshTokenHash,
      expiresAt,
      userAgent: input.userAgent ?? null,
      ipAddress: input.ipAddress ?? null,
    })
    .returning({ id: userSessions.id });

  return { sessionId: row.id };
}

export async function findActiveSession(
  refreshTokenHash: string,
): Promise<{ id: string; userId: string } | null> {
  const [row] = await db
    .select({ id: userSessions.id, userId: userSessions.userId })
    .from(userSessions)
    .where(
      and(
        eq(userSessions.refreshTokenHash, refreshTokenHash),
        isNull(userSessions.revokedAt),
        gt(userSessions.expiresAt, sql`now()`),
      ),
    )
    .limit(1);

  return row ?? null;
}

export async function revokeSession(sessionId: string): Promise<void> {
  await db
    .update(userSessions)
    .set({ revokedAt: sql`now()` })
    .where(eq(userSessions.id, sessionId));
}

export async function revokeAllSessionsForUser(
  userId: string,
): Promise<void> {
  await db
    .update(userSessions)
    .set({ revokedAt: sql`now()` })
    .where(
      and(eq(userSessions.userId, userId), isNull(userSessions.revokedAt)),
    );
}
