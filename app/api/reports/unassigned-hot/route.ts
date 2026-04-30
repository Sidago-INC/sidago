// app/api/reports/unassigned-hot/route.ts
// Same data shape as Currently Hot, with one extra filter: the brand's
// lead_brand_state row has no agent assigned (to_be_called_by_user_id IS NULL).
// These are the leads the dialer queue can't pick up until someone is assigned.
//
// Usage:
//   GET /api/reports/unassigned-hot?brand=svg
//   GET /api/reports/unassigned-hot?brand=95rm
//   GET /api/reports/unassigned-hot?brand=benton

import { NextResponse } from "next/server";
import { alias } from "drizzle-orm/pg-core";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { brands, companies, leadBrandState, leads, users } from "@/lib/db/schema";

const VALID_BRANDS = ["svg", "95rm", "benton"] as const;
type ValidBrand = (typeof VALID_BRANDS)[number];

function stripTimezonePrefix(tz: string | null | undefined): string {
  return (tz ?? "").replace(/^\d+-/, "");
}

function buildName(
  full: string | null,
  first: string | null,
  last: string | null,
): string {
  if (full && full.trim()) return full;
  return [first, last].filter(Boolean).join(" ").trim();
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
        svgLeadType: svgState.leadType,
        svgLastCallDate: svgState.lastCalledDate,
        svgDateBecomeHot: svgState.dateBecameHot,
        svgCallerName: svgCaller.fullName,
        svgCallerFirst: svgCaller.firstName,
        svgCallerLast: svgCaller.lastName,
        bentonLeadType: bentonState.leadType,
        bentonLastCallDate: bentonState.lastCalledDate,
        bentonDateBecomeHot: bentonState.dateBecameHot,
        bentonCallerName: bentonCaller.fullName,
        bentonCallerFirst: bentonCaller.firstName,
        bentonCallerLast: bentonCaller.lastName,
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
      .leftJoin(svgBrand, eq(svgBrand.code, "svg"))
      .leftJoin(
        svgState,
        and(eq(svgState.leadId, leads.id), eq(svgState.brandId, svgBrand.id)),
      )
      .leftJoin(bentonBrand, eq(bentonBrand.code, "benton"))
      .leftJoin(
        bentonState,
        and(eq(bentonState.leadId, leads.id), eq(bentonState.brandId, bentonBrand.id)),
      )
      .leftJoin(rm95Brand, eq(rm95Brand.code, "95rm"))
      .leftJoin(
        rm95State,
        and(eq(rm95State.leadId, leads.id), eq(rm95State.brandId, rm95Brand.id)),
      )
      .leftJoin(svgCaller, eq(svgCaller.id, svgState.toBeCalledByUserId))
      .leftJoin(bentonCaller, eq(bentonCaller.id, bentonState.toBeCalledByUserId))
      .leftJoin(rm95Caller, eq(rm95Caller.id, rm95State.toBeCalledByUserId))
      .where(
        and(
          eq(primaryState.leadType, "Hot"),
          isNull(primaryState.toBeCalledByUserId),
        ),
      );

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
