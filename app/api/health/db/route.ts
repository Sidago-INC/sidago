// app/api/health/db/route.ts
// Smoke test: confirms the .env -> pool -> Drizzle -> Supabase chain is alive.
// Hit GET /api/health/db in the browser. Expect ~4 brands from the seed data.
// Safe to delete once Part 2 reports are wired up.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { brands } from "@/lib/db/schema";

export async function GET() {
  try {
    const rows = await db.select().from(brands);
    return NextResponse.json({
      ok: true,
      count: rows.length,
      brands: rows,
    });
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
