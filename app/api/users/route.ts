// app/api/users/route.ts
// Returns active calling agents assigned to a given brand.
//
// Used by drawer dropdowns (To Be Called By) so the choices reflect real DB
// users for that brand instead of the hardcoded AGENT_VALUES list.
//
// Usage:
//   GET /api/users?brand=svg     → SVG agents
//   GET /api/users?brand=95rm    → 95RM agents
//   GET /api/users?brand=benton  → Benton agents
//
// Filter: role.code = 'agent' AND user.is_active = true.
// Admins/managers are excluded — agents are the only ones who appear in the
// dialer queue.

import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  brands,
  roles,
  userRoleAssignments,
  users,
} from "@/lib/db/schema";

const VALID_BRANDS = ["svg", "95rm", "benton"] as const;
type ValidBrand = (typeof VALID_BRANDS)[number];

export async function GET(request: Request) {
  const brand = (
    new URL(request.url).searchParams.get("brand") ?? ""
  ).toLowerCase();

  if (!VALID_BRANDS.includes(brand as ValidBrand)) {
    return NextResponse.json(
      {
        ok: false,
        error: `Invalid or missing brand. Use one of: ${VALID_BRANDS.join(", ")}`,
      },
      { status: 400 },
    );
  }

  try {
    // Display name = COALESCE(full_name, first || ' ' || last)
    const displayName = sql<string>`TRIM(COALESCE(${users.fullName}, COALESCE(${users.firstName}, '') || ' ' || COALESCE(${users.lastName}, '')))`;

    const rows = await db
      .selectDistinct({
        id: users.id,
        name: displayName,
        email: users.email,
      })
      .from(users)
      .innerJoin(userRoleAssignments, eq(userRoleAssignments.userId, users.id))
      .innerJoin(roles, eq(roles.id, userRoleAssignments.roleId))
      .innerJoin(brands, eq(brands.id, userRoleAssignments.brandId))
      .where(
        and(
          eq(brands.code, brand),
          eq(roles.code, "agent"),
          eq(users.isActive, true),
        ),
      )
      .orderBy(displayName);

    return NextResponse.json({ ok: true, count: rows.length, data: rows });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
