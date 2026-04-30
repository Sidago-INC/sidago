// app/api/reports/recent-interest/route.ts
// Recent Interest = call_logs rows where result_code = 'Interested' (the "G"
// call code per the Airtable doc). Each Interested call creates one row on
// the report — same lead can appear multiple times if they were marked
// Interested on different days.
//
// Response shape matches RecentInterestRow in
// features/backoffice-recent-interest/_lib/data.ts.
//
// Usage:
//   GET /api/reports/recent-interest?brand=svg
//   GET /api/reports/recent-interest?brand=95rm
//   GET /api/reports/recent-interest?brand=benton

import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  brands,
  callLogs,
  companies,
  leadBrandState,
  leads,
  users,
} from "@/lib/db/schema";

const VALID_BRANDS = ["svg", "95rm", "benton"] as const;
type ValidBrand = (typeof VALID_BRANDS)[number];

const BRAND_LABEL: Record<ValidBrand, string> = {
  svg: "SVG",
  "95rm": "95RM",
  benton: "Benton",
};

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
    const rows = await db
      .select({
        callId: callLogs.id,
        calledAt: callLogs.calledAt,
        notes: callLogs.notes,
        resultCode: callLogs.resultCode,
        fullName: leads.fullName,
        email: leads.email,
        phone: leads.phone,
        leadTimezone: leads.timezone,
        companyName: companies.companyName,
        companyTimezone: companies.timezone,
        leadType: leadBrandState.leadType,
        followUpDate: leadBrandState.followUpDate,
        agentFull: users.fullName,
        agentFirst: users.firstName,
        agentLast: users.lastName,
      })
      .from(callLogs)
      .innerJoin(
        brands,
        and(eq(brands.id, callLogs.brandId), eq(brands.code, brand)),
      )
      .innerJoin(leads, eq(leads.id, callLogs.leadId))
      .innerJoin(companies, eq(companies.id, leads.companyId))
      .leftJoin(
        leadBrandState,
        and(
          eq(leadBrandState.leadId, leads.id),
          eq(leadBrandState.brandId, brands.id),
        ),
      )
      .leftJoin(users, eq(users.id, callLogs.userId))
      .where(eq(callLogs.resultCode, "Interested"))
      .orderBy(desc(callLogs.calledAt));

    const campaignLabel = BRAND_LABEL[brand as ValidBrand];

    const data = rows.map((r) => {
      const calledAtDate = r.calledAt ? new Date(r.calledAt) : null;
      const calledIso = calledAtDate
        ? calledAtDate.toISOString().split("T")[0]
        : "";

      return {
        followUpDate: r.followUpDate ?? "",
        followUpDateCleaned: r.followUpDate ?? "",
        lead: r.leadType ?? "",
        campaignType: campaignLabel,
        contactPerson: r.fullName ?? "",
        companyName: r.companyName ?? "",
        email: r.email ?? "",
        assignedTo: buildName(r.agentFull, r.agentFirst, r.agentLast),
        callResult: r.resultCode ?? "Interested",
        leadType: r.leadType ?? "",
        notes: r.notes ?? "",
        phone: r.phone ?? "",
        timezone: stripTimezonePrefix(r.companyTimezone ?? r.leadTimezone),
        created: calledIso,
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
