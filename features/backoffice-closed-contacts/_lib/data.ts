export type ClosedContactRow = {
  lead: string;
  companyName: string;
  fullName: string;
  phone: string;
  email: string;
  timezone: string;
  contactType: string;
  leadType: string;
  bentonLeadType: string;
  svgToBeCalledBy: string;
  bentonToBeCalledBy: string;
  lastActionDate: string;
};

export const closedContactsData: ClosedContactRow[] = [
  {
    lead: "Qualified",
    companyName: "Northwind Labs",
    fullName: "Ariana West",
    phone: "+1 415 221 0901",
    email: "ariana@northwind.io",
    timezone: "EST",
    contactType: "Interested",
    leadType: "Hot",
    bentonLeadType: "Warm",
    svgToBeCalledBy: "Hasib",
    bentonToBeCalledBy: "Rafi",
    lastActionDate: "2026-04-12 10:30 AM",
  },
  {
    lead: "Follow Up",
    companyName: "BluePeak Digital",
    fullName: "Rayan Chowdhury",
    phone: "+1 202 555 0188",
    email: "rayan@bluepeak.com",
    timezone: "PST",
    contactType: "Call Lead Back",
    leadType: "Warm",
    bentonLeadType: "Hot",
    svgToBeCalledBy: "Nafis",
    bentonToBeCalledBy: "Maliha",
    lastActionDate: "2026-04-14 03:15 PM",
  },
  {
    lead: "Interested",
    companyName: "Harbor Ledger",
    fullName: "Grace Miller",
    phone: "+1 212 555 0129",
    email: "grace@harborledger.com",
    timezone: "EST",
    contactType: "Prospecting",
    leadType: "Referral",
    bentonLeadType: "General",
    svgToBeCalledBy: "Asha",
    bentonToBeCalledBy: "Tanvir",
    lastActionDate: "2026-04-16 08:55 AM",
  },
  {
    lead: "Re-Engaged",
    companyName: "Evercore Media",
    fullName: "Sophia Turner",
    phone: "+44 20 7946 0132",
    email: "sophia@evercoremedia.co.uk",
    timezone: "GMT",
    contactType: "Interested",
    leadType: "Warm",
    bentonLeadType: "Hot",
    svgToBeCalledBy: "Hasib",
    bentonToBeCalledBy: "Tanvir",
    lastActionDate: "2026-04-17 02:25 PM",
  },
];

export const leadOptions = [
  "Interested",
  "Qualified",
  "Follow Up",
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

export function getCompanySymbolOptions(rows: ClosedContactRow[]): string[] {
  return Array.from(new Set(rows.map((row) => getCompanySymbol(row.companyName))));
}
