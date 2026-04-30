// app/api/reports/ever-been-hot/route.ts
// Ever Been Hot = leads who have at least one hot_lead_events row with
// event_type='became_hot' for the queried brand.
//
// Dedup rule (per the Airtable workflow): one displayed row per
//   (lead_id, brand_id, user_id)
// where user_id is the agent who promoted the lead in that specific hot phase.
//
//   • same lead + same agent toggled Hot/General multiple times → 1 row
//     (we keep the latest became_hot event_at)
//   • same lead + 2 different agents across phases → 2 separate rows
//
// On each row, the PRIMARY brand's columns (svg/95rm/benton depending on the
// page) carry the historical hot-phase data: ToBeCalledBy = the phase agent,
// DateBecomeHot = that became_hot event_at, LeadType = 'Hot' (by definition).
// Other-brand columns reflect the lead's CURRENT state in those brands.
//
// Usage:
//   GET /api/reports/ever-been-hot?brand=svg
//   GET /api/reports/ever-been-hot?brand=95rm
//   GET /api/reports/ever-been-hot?brand=benton

import { NextResponse } from "next/server";
import { alias } from "drizzle-orm/pg-core";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  brands,
  companies,
  hotLeadEvents,
  leadBrandState,
  leads,
  users,
} from "@/lib/db/schema";

const VALID_BRANDS = ["svg", "95rm", "benton"] as const;
type ValidBrand = (typeof VALID_BRANDS)[number];

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
    const primaryBrand = alias(brands, "primary_brand");
    const phaseAgent = alias(users, "phase_agent");

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
        eventAt: hotLeadEvents.eventAt,
        phaseUserId: hotLeadEvents.userId,
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
        // Phase agent (the one who promoted this hot phase)
        phaseAgentFull: phaseAgent.fullName,
        phaseAgentFirst: phaseAgent.firstName,
        phaseAgentLast: phaseAgent.lastName,
        // Cross-brand current state — SVG
        svgLeadType: svgState.leadType,
        svgLastCallDate: svgState.lastCalledDate,
        svgDateBecomeHot: svgState.dateBecameHot,
        svgCallerName: svgCaller.fullName,
        svgCallerFirst: svgCaller.firstName,
        svgCallerLast: svgCaller.lastName,
        // Cross-brand — Benton
        bentonLeadType: bentonState.leadType,
        bentonLastCallDate: bentonState.lastCalledDate,
        bentonDateBecomeHot: bentonState.dateBecameHot,
        bentonCallerName: bentonCaller.fullName,
        bentonCallerFirst: bentonCaller.firstName,
        bentonCallerLast: bentonCaller.lastName,
        // Cross-brand — 95RM
        rm95LeadType: rm95State.leadType,
        rm95LastCallDate: rm95State.lastCalledDate,
        rm95DateBecomeHot: rm95State.dateBecameHot,
        rm95CallerName: rm95Caller.fullName,
        rm95CallerFirst: rm95Caller.firstName,
        rm95CallerLast: rm95Caller.lastName,
      })
      .from(hotLeadEvents)
      .innerJoin(
        primaryBrand,
        and(
          eq(primaryBrand.id, hotLeadEvents.brandId),
          eq(primaryBrand.code, brand),
        ),
      )
      .innerJoin(leads, eq(leads.id, hotLeadEvents.leadId))
      .innerJoin(companies, eq(companies.id, leads.companyId))
      .leftJoin(phaseAgent, eq(phaseAgent.id, hotLeadEvents.userId))
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
      .where(eq(hotLeadEvents.eventType, "became_hot"));

    // Dedup per (lead_id, phaseUserId): keep the latest event_at.
    const dedupMap = new Map<string, (typeof rows)[number]>();
    for (const row of rows) {
      const key = `${row.leadId}__${row.phaseUserId ?? "null"}`;
      const existing = dedupMap.get(key);
      if (!existing) {
        dedupMap.set(key, row);
        continue;
      }
      if (
        row.eventAt &&
        existing.eventAt &&
        new Date(row.eventAt).getTime() >
          new Date(existing.eventAt).getTime()
      ) {
        dedupMap.set(key, row);
      }
    }

    const data = Array.from(dedupMap.values()).map((r) => {
      const phaseAgentName = buildName(
        r.phaseAgentFull,
        r.phaseAgentFirst,
        r.phaseAgentLast,
      );
      const phaseDateBecameHot = r.eventAt
        ? new Date(r.eventAt).toISOString().split("T")[0]
        : "";

      // Cross-brand current-state values
      let svgLeadType = r.svgLeadType ?? "";
      let svgToBeCalledBy = buildName(
        r.svgCallerName,
        r.svgCallerFirst,
        r.svgCallerLast,
      );
      let svgLastCallDate = r.svgLastCallDate ?? "";
      let svgDateBecomeHot = r.svgDateBecomeHot ?? "";

      let bentonLeadType = r.bentonLeadType ?? "";
      let bentonToBeCalledBy = buildName(
        r.bentonCallerName,
        r.bentonCallerFirst,
        r.bentonCallerLast,
      );
      let bentonLastCallDate = r.bentonLastCallDate ?? "";
      let bentonDateBecomeHot = r.bentonDateBecomeHot ?? "";

      let rm95LeadType = r.rm95LeadType ?? "";
      let rm95ToBeCalledBy = buildName(
        r.rm95CallerName,
        r.rm95CallerFirst,
        r.rm95CallerLast,
      );
      let rm95LastCallDate = r.rm95LastCallDate ?? "";
      let rm95DateBecomeHot = r.rm95DateBecomeHot ?? "";

      // Override the primary brand's columns with the hot-phase data —
      // that's the whole point of the report.
      if (brand === "svg") {
        svgLeadType = "Hot";
        svgToBeCalledBy = phaseAgentName;
        svgDateBecomeHot = phaseDateBecameHot;
      } else if (brand === "95rm") {
        rm95LeadType = "Hot";
        rm95ToBeCalledBy = phaseAgentName;
        rm95DateBecomeHot = phaseDateBecameHot;
      } else if (brand === "benton") {
        bentonLeadType = "Hot";
        bentonToBeCalledBy = phaseAgentName;
        bentonDateBecomeHot = phaseDateBecameHot;
      }

      return {
        leadId: r.leadId,
        lead: "Hot",
        companyName: r.companyName ?? "",
        fullName: r.fullName ?? "",
        phone: r.phone ?? "",
        role: r.role ?? "",
        email: r.email ?? "",
        timezone: stripTimezonePrefix(r.companyTimezone ?? r.leadTimezone),
        contactType: r.contactType ?? "",
        svgLeadType,
        svgToBeCalledBy,
        svgLastCallDate,
        bentonLeadType,
        bentonToBeCalledBy,
        bentonLastCallDate,
        rm95LeadType,
        rm95ToBeCalledBy,
        rm95LastCallDate,
        svgDateBecomeHot,
        bentonDateBecomeHot,
        rm95DateBecomeHot,
        lastActionDate: "",
        notWorked: r.notWorkAnymore ?? false,
      };
    });

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
