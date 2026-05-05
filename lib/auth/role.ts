import { db } from "@/lib/db";
import { roles, userRoleAssignments } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export type ClientRole = "agent" | "admin" | "backoffice";

// DB role codes use 'manager' where the frontend uses 'backoffice'.
// Translate at the auth boundary so the rest of the frontend (lib/navigation,
// lib/auth-routing) keeps working without changes.
export function dbRoleToClientRole(dbRole: string): ClientRole {
  switch (dbRole) {
    case "manager":
      return "backoffice";
    case "admin":
      return "admin";
    case "agent":
      return "agent";
    default:
      return "agent";
  }
}

// Each user typically has only one role type (admin / manager / agent), but
// the priority order here guards against future cases where a user has more
// than one. Higher = more privileged = picked first.
export async function getUserRole(userId: string): Promise<ClientRole> {
  const [row] = await db
    .select({ code: roles.code })
    .from(userRoleAssignments)
    .innerJoin(roles, eq(roles.id, userRoleAssignments.roleId))
    .where(eq(userRoleAssignments.userId, userId))
    .orderBy(
      sql`CASE ${roles.code}
            WHEN 'admin'   THEN 1
            WHEN 'manager' THEN 2
            WHEN 'agent'   THEN 3
            ELSE 4
          END`,
    )
    .limit(1);

  if (!row) return "agent";
  return dbRoleToClientRole(row.code);
}
