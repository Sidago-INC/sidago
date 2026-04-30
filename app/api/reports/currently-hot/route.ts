// app/api/reports/currently-hot/route.ts
// Returns the rows shown on the "Currently Hot Leads" report for one brand.
// Anchor: lead_brand_state where brand=$brand AND lead_type='Hot'.
// Response shape matches HotLeadRow in features/backoffice-shared/types.ts so
// the existing table component can consume the data unchanged.
//
// Usage:
//   GET /api/reports/currently-hot?brand=svg
//   GET /api/reports/currently-hot?brand=95rm
//   GET /api/reports/currently-hot?brand=benton

import { NextResponse } from "next/server";
import { alias } from "drizzle-orm/pg-core";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { brands, companies, leadBrandState, leads, users } from "@/lib/db/schema";

const VALID_BRANDS = ["svg", "95rm", "benton"] as const;
type ValidBrand = (typeof VALID_BRANDS)[number];

function stripTimezonePrefix(tz: string | null | undefined): string {
  return (tz ?? "").replace(/^\d+-/, "");
}

export async function GET(request: Request) {
  const brand = (
    new URL(request.url).searchParams.get("brand") ?? "svg"
  ).toLowerCase();

  if (!VALID_BRANDS.includes(brand as ValidBrand)) {
    return NextResponse.json(
      { ok: false, error: `Invalid brand. Use one of: ${VALID_BRANDS.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    // Self-join aliases. The query anchors on `primary_state` (the brand we're
    // querying for) and pulls in the other two brand states + assignee names
    // via LEFT JOINs so a row still appears even if the lead has no state row
    // for one of the other brands.
    const primaryState = alias(leadBrandState, "primary_state");
    const primaryBrand = alias(brands, "primary_brand");

    const svgState = alias(leadBrandState, "svg_state");
    const bentonState = alias(leadBrandState, "benton_state");
    const rm95State = alias(leadBrandState, "rm95_state");

    const svgBrand = alias(brands, "svg_brand");
    const bentonBrand = alias(brands, "benton_brand");
    const rm95Brand = alias(brands, "rm95_brand");

    const svgCaller = alias(users, "svg_caller");
    const bentonCaller = alias(users, "benton_caller");
    const rm95Caller = alias(users, "rm95_caller");

    const rows = await db
      .select({
        // lead/company
        leadId: leads.id,
        fullName: leads.fullName,
        phone: leads.phone,
        email: leads.email,
        role: leads.role,
        leadTimezone: leads.timezone,
        contactType: leads.contactType,
        notWorkAnymore: leads.notWorkAnymore,
        companyName: companies.companyName,
        companyTimezone: companies.timezone,
        // SVG
        svgLeadType: svgState.leadType,
        svgLastCallDate: svgState.lastCalledDate,
        svgDateBecomeHot: svgState.dateBecameHot,
        svgCallerName: svgCaller.fullName,
        svgCallerFirst: svgCaller.firstName,
        svgCallerLast: svgCaller.lastName,
        // Benton
        bentonLeadType: bentonState.leadType,
        bentonLastCallDate: bentonState.lastCalledDate,
        bentonDateBecomeHot: bentonState.dateBecameHot,
        bentonCallerName: bentonCaller.fullName,
        bentonCallerFirst: bentonCaller.firstName,
        bentonCallerLast: bentonCaller.lastName,
        // 95RM
        rm95LeadType: rm95State.leadType,
        rm95LastCallDate: rm95State.lastCalledDate,
        rm95DateBecomeHot: rm95State.dateBecameHot,
        rm95CallerName: rm95Caller.fullName,
        rm95CallerFirst: rm95Caller.firstName,
        rm95CallerLast: rm95Caller.lastName,
      })
      .from(primaryState)
      .innerJoin(
        primaryBrand,
        and(
          eq(primaryBrand.id, primaryState.brandId),
          eq(primaryBrand.code, brand),
        ),
      )
      .innerJoin(leads, eq(leads.id, primaryState.leadId))
      .innerJoin(companies, eq(companies.id, leads.companyId))
      // SVG state
      .leftJoin(svgBrand, eq(svgBrand.code, "svg"))
      .leftJoin(
        svgState,
        and(eq(svgState.leadId, leads.id), eq(svgState.brandId, svgBrand.id)),
      )
      // Benton state
      .leftJoin(bentonBrand, eq(bentonBrand.code, "benton"))
      .leftJoin(
        bentonState,
        and(eq(bentonState.leadId, leads.id), eq(bentonState.brandId, bentonBrand.id)),
      )
      // 95RM state
      .leftJoin(rm95Brand, eq(rm95Brand.code, "95rm"))
      .leftJoin(
        rm95State,
        and(eq(rm95State.leadId, leads.id), eq(rm95State.brandId, rm95Brand.id)),
      )
      // Assignee name lookups
      .leftJoin(svgCaller, eq(svgCaller.id, svgState.toBeCalledByUserId))
      .leftJoin(bentonCaller, eq(bentonCaller.id, bentonState.toBeCalledByUserId))
      .leftJoin(rm95Caller, eq(rm95Caller.id, rm95State.toBeCalledByUserId))
      .where(eq(primaryState.leadType, "Hot"));

    const buildName = (
      full: string | null,
      first: string | null,
      last: string | null,
    ): string => {
      if (full && full.trim()) return full;
      const composed = [first, last].filter(Boolean).join(" ").trim();
      return composed;
    };

    // Match the HotLeadRow shape consumed by CurrentlyHotTable.
    const data = rows.map((r) => ({
      leadId: r.leadId,
      lead: r.svgLeadType ?? "",
      companyName: r.companyName ?? "",
      fullName: r.fullName ?? "",
      phone: r.phone ?? "",
      role: r.role ?? "",
      email: r.email ?? "",
      timezone: stripTimezonePrefix(r.companyTimezone ?? r.leadTimezone),
      contactType: r.contactType ?? "",
      svgLeadType: r.svgLeadType ?? "",
      svgToBeCalledBy: buildName(r.svgCallerName, r.svgCallerFirst, r.svgCallerLast),
      svgLastCallDate: r.svgLastCallDate ?? "",
      bentonLeadType: r.bentonLeadType ?? "",
      bentonToBeCalledBy: buildName(
        r.bentonCallerName,
        r.bentonCallerFirst,
        r.bentonCallerLast,
      ),
      bentonLastCallDate: r.bentonLastCallDate ?? "",
      rm95LeadType: r.rm95LeadType ?? "",
      rm95ToBeCalledBy: buildName(r.rm95CallerName, r.rm95CallerFirst, r.rm95CallerLast),
      rm95LastCallDate: r.rm95LastCallDate ?? "",
      svgDateBecomeHot: r.svgDateBecomeHot ?? "",
      bentonDateBecomeHot: r.bentonDateBecomeHot ?? "",
      rm95DateBecomeHot: r.rm95DateBecomeHot ?? "",
      lastActionDate: "",
      notWorked: r.notWorkAnymore ?? false,
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
