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

export type ClosedContactsTabKey =
  | "svg-current"
  | "svg-historical"
  | "benton-current"
  | "benton-historical"
  | "all-closed-contracts";

export type ClosedContactsTab = {
  key: ClosedContactsTabKey;
  label: string;
  title: string;
  data: ClosedContactRow[];
};

export const svgCurrentClosedContactsData: ClosedContactRow[] = [
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
  {
    lead: "Interested",
    companyName: "Crestline Ops",
    fullName: "Marcus Bell",
    phone: "+1 312 555 0194",
    email: "marcus@crestlineops.com",
    timezone: "CST",
    contactType: "Left Message",
    leadType: "Warm",
    bentonLeadType: "General",
    svgToBeCalledBy: "Asha",
    bentonToBeCalledBy: "Tanvir",
    lastActionDate: "2026-04-16 01:40 PM",
  },
];

export const svgHistoricalClosedContactsData: ClosedContactRow[] = [
  {
    lead: "Interested",
    companyName: "Lumen Works",
    fullName: "Daniel Ross",
    phone: "+1 469 555 0141",
    email: "daniel@lumenworks.com",
    timezone: "CST",
    contactType: "Interested",
    leadType: "Warm",
    bentonLeadType: "General",
    svgToBeCalledBy: "Hasib",
    bentonToBeCalledBy: "Rafi",
    lastActionDate: "2026-03-28 11:20 AM",
  },
  {
    lead: "Follow Up",
    companyName: "Atlas Freight",
    fullName: "Sadia Rahman",
    phone: "+1 303 555 0192",
    email: "sadia@atlasfreight.com",
    timezone: "MST",
    contactType: "Left Message",
    leadType: "General",
    bentonLeadType: "Warm",
    svgToBeCalledBy: "Asha",
    bentonToBeCalledBy: "Tanvir",
    lastActionDate: "2026-03-21 04:50 PM",
  },
  {
    lead: "Qualified",
    companyName: "Metro Vertex",
    fullName: "Elena Cruz",
    phone: "+1 305 555 0162",
    email: "elena@metrovertex.com",
    timezone: "EST",
    contactType: "Prospecting",
    leadType: "Referral",
    bentonLeadType: "Hot",
    svgToBeCalledBy: "Nafis",
    bentonToBeCalledBy: "Maliha",
    lastActionDate: "2026-03-17 09:35 AM",
  },
];

export const bentonCurrentClosedContactsData: ClosedContactRow[] = [
  {
    lead: "Interested",
    companyName: "Vertex Commerce",
    fullName: "Imran Ali",
    phone: "+1 617 555 0114",
    email: "imran@vertexcommerce.com",
    timezone: "EST",
    contactType: "Interested",
    leadType: "General",
    bentonLeadType: "Warm",
    svgToBeCalledBy: "Hasib",
    bentonToBeCalledBy: "Tanvir",
    lastActionDate: "2026-04-13 01:05 PM",
  },
  {
    lead: "Qualified",
    companyName: "Harbor Ledger",
    fullName: "Grace Miller",
    phone: "+1 212 555 0129",
    email: "grace@harborledger.com",
    timezone: "EST",
    contactType: "Call Lead Back",
    leadType: "Referral",
    bentonLeadType: "Hot",
    svgToBeCalledBy: "Asha",
    bentonToBeCalledBy: "Maliha",
    lastActionDate: "2026-04-12 03:10 PM",
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
    svgToBeCalledBy: "Nafis",
    bentonToBeCalledBy: "Rafi",
    lastActionDate: "2026-04-14 10:45 AM",
  },
];

export const bentonHistoricalClosedContactsData: ClosedContactRow[] = [
  {
    lead: "Follow Up",
    companyName: "Orbit Analytics",
    fullName: "Priya Sen",
    phone: "+91 80 5555 0198",
    email: "priya@orbitanalytics.in",
    timezone: "IST",
    contactType: "Left Message",
    leadType: "Referral",
    bentonLeadType: "Warm",
    svgToBeCalledBy: "Hasib",
    bentonToBeCalledBy: "Tanvir",
    lastActionDate: "2026-03-19 08:15 AM",
  },
  {
    lead: "Interested",
    companyName: "Transit Core",
    fullName: "Victor Lopez",
    phone: "+34 91 555 0130",
    email: "victor@transitcore.es",
    timezone: "CET",
    contactType: "Interested",
    leadType: "Hot",
    bentonLeadType: "General",
    svgToBeCalledBy: "Asha",
    bentonToBeCalledBy: "Maliha",
    lastActionDate: "2026-03-14 02:05 PM",
  },
  {
    lead: "Qualified",
    companyName: "Apex Imports",
    fullName: "Hiro Tanaka",
    phone: "+81 3 5550 0120",
    email: "hiro@apeximports.jp",
    timezone: "JST",
    contactType: "Prospecting",
    leadType: "Warm",
    bentonLeadType: "Hot",
    svgToBeCalledBy: "Nafis",
    bentonToBeCalledBy: "Rafi",
    lastActionDate: "2026-03-10 06:30 PM",
  },
];

export const allClosedContractsData: ClosedContactRow[] = [
  ...svgCurrentClosedContactsData,
  ...svgHistoricalClosedContactsData,
  ...bentonCurrentClosedContactsData,
  ...bentonHistoricalClosedContactsData,
];

export const closedContactsTabs: ClosedContactsTab[] = [
  {
    key: "svg-current",
    label: "SVG Current",
    title: "Closed Contacts - SVG Current",
    data: svgCurrentClosedContactsData,
  },
  {
    key: "svg-historical",
    label: "SVG Historical",
    title: "Closed Contacts - SVG Historical",
    data: svgHistoricalClosedContactsData,
  },
  {
    key: "benton-current",
    label: "Benton Current",
    title: "Closed Contacts - Benton Current",
    data: bentonCurrentClosedContactsData,
  },
  {
    key: "benton-historical",
    label: "Benton Historical",
    title: "Closed Contacts - Benton Historical",
    data: bentonHistoricalClosedContactsData,
  },
  {
    key: "all-closed-contracts",
    label: "All Closed Contracts",
    title: "All Closed Contracts",
    data: allClosedContractsData,
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
  return Array.from(
    new Set(rows.map((row) => getCompanySymbol(row.companyName))),
  );
}
