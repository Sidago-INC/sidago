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
  to_be_called_by?: string | null; // empty string / null clears the assignee
  last_called_date?: string | null;
};

type PatchBody = {
  lead?: LeadFields;
  brandStates?: Partial<Record<ValidBrand, BrandStateFields>>;
};

// Look up a user UUID by display name. Tries `full_name` first, then falls
// back to "first_name last_name". Returns null if the input is empty.
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

  // Verify the lead exists up front so we don't run partial updates on a
  // missing row.
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

  let leadUpdates = 0;
  const brandUpdates: Record<string, number> = {};

  try {
    // --- Lead-level fields ---
    if (body.lead) {
      const setClause: Record<string, unknown> = {};

      if (body.lead.full_name !== undefined)
        setClause.fullName = body.lead.full_name;
      if (body.lead.phone !== undefined) setClause.phone = body.lead.phone;
      if (body.lead.email !== undefined) setClause.email = body.lead.email;
      if (body.lead.role !== undefined) setClause.role = body.lead.role;
      if (body.lead.contact_type !== undefined)
        setClause.contactType = body.lead.contact_type;
      if (body.lead.not_work_anymore !== undefined)
        setClause.notWorkAnymore = body.lead.not_work_anymore;

      if (body.lead.company_name !== undefined) {
        const resolved = await resolveCompanyId(body.lead.company_name);
        if (!resolved.ok) {
          return NextResponse.json(
            { ok: false, error: resolved.error },
            { status: 400 },
          );
        }
        setClause.companyId = resolved.id;
      }

      if (Object.keys(setClause).length > 0) {
        setClause.updatedAt = new Date().toISOString();
        const result = await db
          .update(leads)
          .set(setClause)
          .where(eq(leads.id, leadId));
        leadUpdates = (result as { count?: number }).count ?? 1;
      }
    }

    // --- Brand-state fields ---
    if (body.brandStates) {
      for (const [brandCode, state] of Object.entries(body.brandStates)) {
        if (!VALID_BRANDS.includes(brandCode as ValidBrand)) {
          return NextResponse.json(
            { ok: false, error: `Invalid brand: ${brandCode}` },
            { status: 400 },
          );
        }
        if (!state) continue;

        const setClause: Record<string, unknown> = {};

        if (state.lead_type !== undefined) setClause.leadType = state.lead_type;
        if (state.last_called_date !== undefined) {
          setClause.lastCalledDate = state.last_called_date || null;
        }
        if (state.to_be_called_by !== undefined) {
          const resolved = await resolveUserId(state.to_be_called_by);
          if (!resolved.ok) {
            return NextResponse.json(
              { ok: false, error: resolved.error },
              { status: 400 },
            );
          }
          setClause.toBeCalledByUserId = resolved.id;
        }

        if (Object.keys(setClause).length === 0) continue;
        setClause.updatedAt = new Date().toISOString();

        // Find the brand row + the lead_brand_state row.
        const brandRow = await db
          .select({ id: brands.id })
          .from(brands)
          .where(eq(brands.code, brandCode))
          .limit(1);

        if (!brandRow.length) continue;

        const result = await db
          .update(leadBrandState)
          .set(setClause)
          .where(
            and(
              eq(leadBrandState.leadId, leadId),
              eq(leadBrandState.brandId, brandRow[0].id),
            ),
          );
        brandUpdates[brandCode] = (result as { count?: number }).count ?? 0;
      }
    }

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
