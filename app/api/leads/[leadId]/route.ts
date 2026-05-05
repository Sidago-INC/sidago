// app/api/leads/[leadId]/route.ts
// PATCH endpoint for updating a single lead and/or its per-brand state from
// the report drawers.
//
// Body shape (all fields optional — send only what changed):
//   {
//     lead?: {
//       full_name?:        string,
//       phone?:            string,
//       email?:            string,
//       role?:             string,
//       contact_type?:     string,
//       not_work_anymore?: boolean,
//       company_name?:     string   // resolved server-side to company_id
//     },
//     brandStates?: {
//       svg?:    { lead_type?, to_be_called_by?, last_called_date? },
//       benton?: { lead_type?, to_be_called_by?, last_called_date? },
//       "95rm"?: { lead_type?, to_be_called_by?, last_called_date? }
//     }
//   }
//
// Server resolves:
//   • company_name  → companies.company_name lookup (400 if not found)
//   • to_be_called_by (full name) → users.full_name lookup (400 if not found,
//     null clears the assignee)
//
// Auth: requires a valid Bearer access token. The user's UUID is bound to the
// transaction so audit_log rows are attributed to the human via set_config()
// → trigger reads current_setting('app.current_user_id').
//
// Returns:
//   { ok: true, leadId, updated: { lead?: <count>, brandStates?: <count> } }

import { NextResponse } from "next/server";
import { and, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  brands,
  companies,
  leadBrandState,
  leads,
  users,
} from "@/lib/db/schema";
import { getUserFromRequest } from "@/lib/auth/middleware";

const VALID_BRANDS = ["svg", "95rm", "benton"] as const;
type ValidBrand = (typeof VALID_BRANDS)[number];

type LeadFields = {
  full_name?: string;
  phone?: string;
  email?: string;
  role?: string;
  contact_type?: string;
  not_work_anymore?: boolean;
  company_name?: string;
};

type BrandStateFields = {
  lead_type?: string;
  to_be_called_by?: string | null;
  last_called_date?: string | null;
};

type PatchBody = {
  lead?: LeadFields;
  brandStates?: Partial<Record<ValidBrand, BrandStateFields>>;
};

async function resolveUserId(
  displayName: string | null | undefined,
): Promise<{ ok: true; id: string | null } | { ok: false; error: string }> {
  if (!displayName || !displayName.trim()) return { ok: true, id: null };
  const name = displayName.trim();

  const found = await db
    .select({ id: users.id })
    .from(users)
    .where(
      or(
        eq(users.fullName, name),
        ilike(
          sql`COALESCE(${users.firstName}, '') || ' ' || COALESCE(${users.lastName}, '')`,
          name,
        ),
      ),
    )
    .limit(1);

  if (!found.length) {
    return { ok: false, error: `User not found: "${name}"` };
  }
  return { ok: true, id: found[0].id };
}

async function resolveCompanyId(
  companyName: string,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const trimmed = companyName.trim();
  if (!trimmed) return { ok: false, error: "company_name cannot be empty" };

  const found = await db
    .select({ id: companies.id })
    .from(companies)
    .where(eq(companies.companyName, trimmed))
    .limit(1);

  if (!found.length) {
    return { ok: false, error: `Company not found: "${trimmed}"` };
  }
  return { ok: true, id: found[0].id };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ leadId: string }> },
) {
  const auth = await getUserFromRequest(request);
  if (!auth) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { leadId } = await params;

  if (!leadId) {
    return NextResponse.json(
      { ok: false, error: "Missing leadId" },
      { status: 400 },
    );
  }

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const existing = await db
    .select({ id: leads.id })
    .from(leads)
    .where(eq(leads.id, leadId))
    .limit(1);

  if (!existing.length) {
    return NextResponse.json(
      { ok: false, error: `Lead not found: ${leadId}` },
      { status: 404 },
    );
  }

  // ------ Pre-resolve every lookup before opening the transaction ------
  // Any validation that returns 400 must happen here so the transaction
  // never opens for a request that's destined to fail.

  let leadSetClause: Record<string, unknown> | null = null;

  if (body.lead) {
    const sc: Record<string, unknown> = {};

    if (body.lead.full_name !== undefined) sc.fullName = body.lead.full_name;
    if (body.lead.phone !== undefined) sc.phone = body.lead.phone;
    if (body.lead.email !== undefined) sc.email = body.lead.email;
    if (body.lead.role !== undefined) sc.role = body.lead.role;
    if (body.lead.contact_type !== undefined)
      sc.contactType = body.lead.contact_type;
    if (body.lead.not_work_anymore !== undefined)
      sc.notWorkAnymore = body.lead.not_work_anymore;

    if (body.lead.company_name !== undefined) {
      const resolved = await resolveCompanyId(body.lead.company_name);
      if (!resolved.ok) {
        return NextResponse.json(
          { ok: false, error: resolved.error },
          { status: 400 },
        );
      }
      sc.companyId = resolved.id;
    }

    if (Object.keys(sc).length > 0) {
      sc.updatedAt = new Date().toISOString();
      leadSetClause = sc;
    }
  }

  type ResolvedBrandUpdate = {
    brandCode: ValidBrand;
    brandId: string;
    setClause: Record<string, unknown>;
  };
  const resolvedBrandUpdates: ResolvedBrandUpdate[] = [];

  if (body.brandStates) {
    for (const [brandCode, state] of Object.entries(body.brandStates)) {
      if (!VALID_BRANDS.includes(brandCode as ValidBrand)) {
        return NextResponse.json(
          { ok: false, error: `Invalid brand: ${brandCode}` },
          { status: 400 },
        );
      }
      if (!state) continue;

      const sc: Record<string, unknown> = {};

      if (state.lead_type !== undefined) sc.leadType = state.lead_type;
      if (state.last_called_date !== undefined) {
        sc.lastCalledDate = state.last_called_date || null;
      }
      if (state.to_be_called_by !== undefined) {
        const resolved = await resolveUserId(state.to_be_called_by);
        if (!resolved.ok) {
          return NextResponse.json(
            { ok: false, error: resolved.error },
            { status: 400 },
          );
        }
        sc.toBeCalledByUserId = resolved.id;
      }

      if (Object.keys(sc).length === 0) continue;
      sc.updatedAt = new Date().toISOString();

      const brandRow = await db
        .select({ id: brands.id })
        .from(brands)
        .where(eq(brands.code, brandCode))
        .limit(1);
      if (!brandRow.length) continue;

      resolvedBrandUpdates.push({
        brandCode: brandCode as ValidBrand,
        brandId: brandRow[0].id,
        setClause: sc,
      });
    }
  }

  // ------ Apply writes in one transaction with audit attribution ------

  let leadUpdates = 0;
  const brandUpdates: Record<string, number> = {};

  try {
    await db.transaction(async (tx) => {
      // set_config(...) is the parameter-safe equivalent of SET LOCAL.
      // The audit_row_changes() trigger reads these via current_setting().
      await tx.execute(
        sql`SELECT set_config('app.current_user_id', ${auth.userId}, true)`,
      );
      await tx.execute(
        sql`SELECT set_config('app.actor_type', 'user', true)`,
      );

      if (leadSetClause) {
        const result = await tx
          .update(leads)
          .set(leadSetClause)
          .where(eq(leads.id, leadId));
        leadUpdates = (result as { count?: number }).count ?? 1;
      }

      for (const up of resolvedBrandUpdates) {
        const result = await tx
          .update(leadBrandState)
          .set(up.setClause)
          .where(
            and(
              eq(leadBrandState.leadId, leadId),
              eq(leadBrandState.brandId, up.brandId),
            ),
          );
        brandUpdates[up.brandCode] = (result as { count?: number }).count ?? 0;
      }
    });

    return NextResponse.json({
      ok: true,
      leadId,
      updated: {
        lead: leadUpdates,
        brandStates: brandUpdates,
      },
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
