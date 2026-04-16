export type UnassignedHotLeadRow = {
  lead: string;
  companyName: string;
  fullName: string;
  phone: string;
  email: string;
  timezone: string;
  contactType: string;
  svgLeadType: string;
  svgToBeCalledBy: string;
  svgLastCallDate: string;
  bentonLeadType: string;
  bentonToBeCalledBy: string;
  bentonLastCallDate: string;
  rm95LeadType: string;
  rm95ToBeCalledBy: string;
  rm95LastCallDate: string;
  svgDateBecomeHot: string;
  bentonDateBecomeHot: string;
  rm95DateBecomeHot: string;
  lastActionDate: string;
};

export const unassignedHotLeadsData: UnassignedHotLeadRow[] = [
  {
    lead: "Hot Lead",
    companyName: "Northwind Logistics",
    fullName: "Ariana West",
    phone: "+1 415 221 0901",
    email: "ariana@northwindlogistics.com",
    timezone: "PST",
    contactType: "Interested",
    svgLeadType: "Hot",
    svgToBeCalledBy: "Hasib",
    svgLastCallDate: "2026-04-14",
    bentonLeadType: "Warm",
    bentonToBeCalledBy: "Maliha",
    bentonLastCallDate: "2026-04-12",
    rm95LeadType: "General",
    rm95ToBeCalledBy: "Tanvir",
    rm95LastCallDate: "2026-04-10",
    svgDateBecomeHot: "2026-04-13",
    bentonDateBecomeHot: "2026-04-11",
    rm95DateBecomeHot: "2026-04-09",
    lastActionDate: "2026-04-14",
  },
  {
    lead: "Qualified",
    companyName: "BluePeak Digital",
    fullName: "Rayan Chowdhury",
    phone: "+1 202 555 0188",
    email: "rayan@bluepeak.com",
    timezone: "EST",
    contactType: "Call Lead Back",
    svgLeadType: "Warm",
    svgToBeCalledBy: "Nafis",
    svgLastCallDate: "2026-04-15",
    bentonLeadType: "Hot",
    bentonToBeCalledBy: "Rafi",
    bentonLastCallDate: "2026-04-14",
    rm95LeadType: "Cold",
    rm95ToBeCalledBy: "Asha",
    rm95LastCallDate: "2026-04-08",
    svgDateBecomeHot: "2026-04-15",
    bentonDateBecomeHot: "2026-04-14",
    rm95DateBecomeHot: "2026-04-07",
    lastActionDate: "2026-04-15",
  },
  {
    lead: "Follow Up",
    companyName: "Summit Freight",
    fullName: "Laura Chen",
    phone: "+1 206 555 0107",
    email: "laura@summitfreight.com",
    timezone: "PST",
    contactType: "Left Message",
    svgLeadType: "Warm",
    svgToBeCalledBy: "Asha",
    svgLastCallDate: "2026-04-11",
    bentonLeadType: "Referral",
    bentonToBeCalledBy: "Hasib",
    bentonLastCallDate: "2026-04-10",
    rm95LeadType: "General",
    rm95ToBeCalledBy: "Maliha",
    rm95LastCallDate: "2026-04-06",
    svgDateBecomeHot: "2026-04-09",
    bentonDateBecomeHot: "2026-04-08",
    rm95DateBecomeHot: "2026-04-05",
    lastActionDate: "2026-04-11",
  },
  {
    lead: "Interested",
    companyName: "Crestline Ops",
    fullName: "Marcus Bell",
    phone: "+1 312 555 0194",
    email: "marcus@crestlineops.com",
    timezone: "CST",
    contactType: "Prospecting",
    svgLeadType: "General",
    svgToBeCalledBy: "Rafi",
    svgLastCallDate: "2026-04-10",
    bentonLeadType: "Warm",
    bentonToBeCalledBy: "Tanvir",
    bentonLastCallDate: "2026-04-09",
    rm95LeadType: "Warm",
    rm95ToBeCalledBy: "Nafis",
    rm95LastCallDate: "2026-04-07",
    svgDateBecomeHot: "2026-04-08",
    bentonDateBecomeHot: "2026-04-08",
    rm95DateBecomeHot: "2026-04-06",
    lastActionDate: "2026-04-10",
  },
  {
    lead: "Re-Engaged",
    companyName: "Harbor Ledger",
    fullName: "Grace Miller",
    phone: "+1 212 555 0129",
    email: "grace@harborledger.com",
    timezone: "EST",
    contactType: "Interested",
    svgLeadType: "Referral",
    svgToBeCalledBy: "Maliha",
    svgLastCallDate: "2026-04-13",
    bentonLeadType: "Hot",
    bentonToBeCalledBy: "Nafis",
    bentonLastCallDate: "2026-04-12",
    rm95LeadType: "Cold",
    rm95ToBeCalledBy: "Hasib",
    rm95LastCallDate: "2026-04-04",
    svgDateBecomeHot: "2026-04-12",
    bentonDateBecomeHot: "2026-04-11",
    rm95DateBecomeHot: "2026-04-03",
    lastActionDate: "2026-04-13",
  },
];

export const leadOptions = [
  "Interested",
  "Qualified",
  "Follow Up",
  "On Interested",
  "Hot Lead",
  "Re-Engaged",
];

export const contactTypeOptions = [
  "Prospecting",
  "Interested",
  "Not Interested",
  "No Answer",
  "Left Message",
  "Call Lead Back",
  "Bad Number",
  "DNC",
];

export const leadTypeOptions = ["Hot", "Warm", "Cold", "General", "Referral"];

export const assigneeOptions = [
  "Hasib",
  "Nafis",
  "Asha",
  "Rafi",
  "Maliha",
  "Tanvir",
];

export const timezoneOptions = [
  "EST",
  "PST",
  "CST",
  "MST",
  "GMT",
  "CET",
  "IST",
  "JST",
];

export function getCompanySymbol(companyName: string): string {
  const words = companyName
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length === 0) {
    return "";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function getCompanySymbolOptions(
  rows: UnassignedHotLeadRow[],
): string[] {
  return Array.from(
    new Set(rows.map((row) => getCompanySymbol(row.companyName))),
  );
}
