// app/api/reports/closed-contracts/route.ts
// Closed contracts report. Three categories per brand:
//
//   • current     → lead_brand_state.lead_type = 'Contract Closed' for the brand
//   • historical  → lead has a closure event for the brand (level_2_requests
//                   with result_update='Contract Closed' OR call_logs with
//                   result_code='Contract Closed') AND current
//                   lead_brand_state.lead_type ≠ 'Contract Closed'
//   • all         → union of current + historical, across all brands
//                   (one row per (lead, brand) that has any closure)
//
// Usage:
//   GET /api/reports/closed-contracts?brand=svg&category=current
//   GET /api/reports/closed-contracts?brand=95rm&category=historical
//   GET /api/reports/closed-contracts?category=all
//
// Response shape matches ClosedContactRow in
// features/backoffice-closed-contacts/_lib/data.ts (extended with rm95 fields
// so the 95RM tabs can display 95RM-specific data).

import { NextResponse } from "next/server";
import { alias } from "drizzle-orm/pg-core";
import { and, eq, exists, ne, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  brands,
  callLogs,
  companies,
  leadBrandState,
  leads,
  level2Requests,
  users,
} from "@/lib/db/schema";

const VALID_BRANDS = ["svg", "95rm", "benton"] as const;
const VALID_CATEGORIES = ["current", "historical", "all"] as const;
type ValidBrand = (typeof VALID_BRANDS)[number];
type ValidCategory = (typeof VALID_CATEGORIES)[number];

const stripTimezonePrefix = (tz: string | null | undefined): string =>
  (tz ?? "").replace(/^\d+-/, "");

const buildName = (
  full: string | null,
  first: string | null,
  last: string | null,
): string => {
  if (full && full.trim()) return full;
  return [first, last].filter(Boolean).join(" ").trim();
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const brandParam = url.searchParams.get("brand")?.toLowerCase();
  const category = (
    url.searchParams.get("category") ?? "current"
  ).toLowerCase();

  if (!VALID_CATEGORIES.includes(category as ValidCategory)) {
    return NextResponse.json(
      {
        ok: false,
        error: `Invalid category. Use one of: ${VALID_CATEGORIES.join(", ")}`,
      },
      { status: 400 },
    );
  }

  // brand is required for current/historical, optional for all
  if (category !== "all") {
    if (!brandParam || !VALID_BRANDS.includes(brandParam as ValidBrand)) {
      return NextResponse.json(
        {
          ok: false,
          error: `Invalid or missing brand. Use one of: ${VALID_BRANDS.join(", ")}`,
        },
        { status: 400 },
      );
    }
  }

  try {
    const primaryBrand = alias(brands, "primary_brand");
    const primaryState = alias(leadBrandState, "primary_state");

    const svgState = alias(leadBrandState, "svg_state");
    const bentonState = alias(leadBrandState, "benton_state");
    const rm95State = alias(leadBrandState, "rm95_state");

    const svgBrand = alias(brands, "svg_brand");
    const bentonBrand = alias(brands, "benton_brand");
    const rm95Brand = alias(brands, "rm95_brand");

    const svgCaller = alias(users, "svg_caller");
    const bentonCaller = alias(users, "benton_caller");
    const rm95Caller = alias(users, "rm95_caller");

    // Closure-event existence subqueries, scoped to the row's primary brand.
    const hasLevel2Close = exists(
      db
        .select({ one: sql`1` })
        .from(level2Requests)
        .where(
          and(
            eq(level2Requests.leadId, leads.id),
            eq(level2Requests.brandId, primaryBrand.id),
            eq(level2Requests.resultUpdate, "Contract Closed"),
          ),
        ),
    );

    const hasCallLogClose = exists(
      db
        .select({ one: sql`1` })
        .from(callLogs)
        .where(
          and(
            eq(callLogs.leadId, leads.id),
            eq(callLogs.brandId, primaryBrand.id),
            eq(callLogs.resultCode, "Contract Closed"),
          ),
        ),
    );

    // Build the WHERE clause based on category.
    let whereClause;
    if (category === "current") {
      whereClause = and(
        eq(primaryBrand.code, brandParam!),
        eq(primaryState.leadType, "Contract Closed"),
      );
    } else if (category === "historical") {
      whereClause = and(
        eq(primaryBrand.code, brandParam!),
        ne(primaryState.leadType, "Contract Closed"),
        or(hasLevel2Close, hasCallLogClose),
      );
    } else {
      // all: every (lead, brand) where there's any closure event or current closure
      whereClause = or(
        eq(primaryState.leadType, "Contract Closed"),
        hasLevel2Close,
        hasCallLogClose,
      );
    }

    const rows = await db
      .select({
        leadId: leads.id,
        primaryBrandCode: primaryBrand.code,
        // lead/company
        fullName: leads.fullName,
        phone: leads.phone,
        email: leads.email,
        role: leads.role,
        leadTimezone: leads.timezone,
        contactType: leads.contactType,
        notWorkAnymore: leads.notWorkAnymore,
        companyName: companies.companyName,
        companyTimezone: companies.timezone,
        // primary brand current state
        primaryLeadType: primaryState.leadType,
        primaryLastCallDate: primaryState.lastCalledDate,
        // SVG cross-brand
        svgLeadType: svgState.leadType,
        svgCallerName: svgCaller.fullName,
        svgCallerFirst: svgCaller.firstName,
        svgCallerLast: svgCaller.lastName,
        // Benton cross-brand
        bentonLeadType: bentonState.leadType,
        bentonCallerName: bentonCaller.fullName,
        bentonCallerFirst: bentonCaller.firstName,
        bentonCallerLast: bentonCaller.lastName,
        // 95RM cross-brand
        rm95LeadType: rm95State.leadType,
        rm95CallerName: rm95Caller.fullName,
        rm95CallerFirst: rm95Caller.firstName,
        rm95CallerLast: rm95Caller.lastName,
      })
      .from(primaryState)
      .innerJoin(primaryBrand, eq(primaryBrand.id, primaryState.brandId))
      .innerJoin(leads, eq(leads.id, primaryState.leadId))
      .innerJoin(companies, eq(companies.id, leads.companyId))
      .leftJoin(svgBrand, eq(svgBrand.code, "svg"))
      .leftJoin(
        svgState,
        and(eq(svgState.leadId, leads.id), eq(svgState.brandId, svgBrand.id)),
      )
      .leftJoin(svgCaller, eq(svgCaller.id, svgState.toBeCalledByUserId))
      .leftJoin(bentonBrand, eq(bentonBrand.code, "benton"))
      .leftJoin(
        bentonState,
        and(
          eq(bentonState.leadId, leads.id),
          eq(bentonState.brandId, bentonBrand.id),
        ),
      )
      .leftJoin(bentonCaller, eq(bentonCaller.id, bentonState.toBeCalledByUserId))
      .leftJoin(rm95Brand, eq(rm95Brand.code, "95rm"))
      .leftJoin(
        rm95State,
        and(eq(rm95State.leadId, leads.id), eq(rm95State.brandId, rm95Brand.id)),
      )
      .leftJoin(rm95Caller, eq(rm95Caller.id, rm95State.toBeCalledByUserId))
      .where(whereClause);

    const data = rows.map((r) => ({
      leadId: r.leadId,
      lead: r.primaryLeadType ?? "",
      companyName: r.companyName ?? "",
      fullName: r.fullName ?? "",
      phone: r.phone ?? "",
      email: r.email ?? "",
      timezone: stripTimezonePrefix(r.companyTimezone ?? r.leadTimezone),
      contactType: r.contactType ?? "",
      // primary brand's current lead_type (drives the "Lead Type" column)
      leadType: r.primaryLeadType ?? "",
      // cross-brand reference fields
      svgLeadType: r.svgLeadType ?? "",
      bentonLeadType: r.bentonLeadType ?? "",
      rm95LeadType: r.rm95LeadType ?? "",
      svgToBeCalledBy: buildName(
        r.svgCallerName,
        r.svgCallerFirst,
        r.svgCallerLast,
      ),
      bentonToBeCalledBy: buildName(
        r.bentonCallerName,
        r.bentonCallerFirst,
        r.bentonCallerLast,
      ),
      rm95ToBeCalledBy: buildName(
        r.rm95CallerName,
        r.rm95CallerFirst,
        r.rm95CallerLast,
      ),
      lastActionDate: r.primaryLastCallDate ?? "",
      // The brand that this row belongs to — handy for the "All" tab
      brand: r.primaryBrandCode ?? "",
    }));

    return NextResponse.json({ ok: true, count: data.length, data });
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
