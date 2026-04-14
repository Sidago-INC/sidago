export type LeadRow = {
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

export const svgCurrentlyHotLeadsData: LeadRow[] = [
  {
    lead: "Interested",
    companyName: "Northwind Labs",
    fullName: "Ariana West",
    phone: "+1 415 221 0901",
    email: "ariana@northwind.io",
    timezone: "EST",
    contactType: "Interested",
    svgLeadType: "Hot",
    svgToBeCalledBy: "Hasib",
    svgLastCallDate: "2026-04-12",
    bentonLeadType: "Warm",
    bentonToBeCalledBy: "Rafi",
    bentonLastCallDate: "2026-04-11",
    rm95LeadType: "Cold",
    rm95ToBeCalledBy: "Tanvir",
    rm95LastCallDate: "2026-04-08",
    svgDateBecomeHot: "2026-04-10",
    bentonDateBecomeHot: "2026-04-09",
    rm95DateBecomeHot: "2026-04-07",
    lastActionDate: "2026-04-12 10:30 AM",
  },
  {
    lead: "Qualified",
    companyName: "BluePeak Digital",
    fullName: "Rayan Chowdhury",
    phone: "+1 202 555 0188",
    email: "rayan@bluepeak.com",
    timezone: "PST",
    contactType: "Call Lead Back",
    svgLeadType: "Warm",
    svgToBeCalledBy: "Nafis",
    svgLastCallDate: "2026-04-14",
    bentonLeadType: "Hot",
    bentonToBeCalledBy: "Maliha",
    bentonLastCallDate: "2026-04-12",
    rm95LeadType: "Warm",
    rm95ToBeCalledBy: "Rafi",
    rm95LastCallDate: "2026-04-11",
    svgDateBecomeHot: "2026-04-13",
    bentonDateBecomeHot: "2026-04-12",
    rm95DateBecomeHot: "2026-04-10",
    lastActionDate: "2026-04-14 03:15 PM",
  },
  {
    lead: "Hot Lead",
    companyName: "BrightPath Health",
    fullName: "Nabila Ahmed",
    phone: "+1 718 555 0133",
    email: "nabila@brightpath.health",
    timezone: "EST",
    contactType: "Interested",
    svgLeadType: "Hot",
    svgToBeCalledBy: "Nafis",
    svgLastCallDate: "2026-04-15",
    bentonLeadType: "Hot",
    bentonToBeCalledBy: "Maliha",
    bentonLastCallDate: "2026-04-14",
    rm95LeadType: "General",
    rm95ToBeCalledBy: "Asha",
    rm95LastCallDate: "2026-04-12",
    svgDateBecomeHot: "2026-04-14",
    bentonDateBecomeHot: "2026-04-13",
    rm95DateBecomeHot: "2026-04-12",
    lastActionDate: "2026-04-15 11:05 AM",
  },
  {
    lead: "Interested",
    companyName: "Summit Freight",
    fullName: "Laura Chen",
    phone: "+1 206 555 0107",
    email: "laura@summitfreight.com",
    timezone: "PST",
    contactType: "Interested",
    svgLeadType: "Referral",
    svgToBeCalledBy: "Hasib",
    svgLastCallDate: "2026-04-09",
    bentonLeadType: "General",
    bentonToBeCalledBy: "Rafi",
    bentonLastCallDate: "2026-04-07",
    rm95LeadType: "Referral",
    rm95ToBeCalledBy: "Maliha",
    rm95LastCallDate: "2026-04-06",
    svgDateBecomeHot: "2026-04-08",
    bentonDateBecomeHot: "2026-04-07",
    rm95DateBecomeHot: "2026-04-06",
    lastActionDate: "2026-04-09 12:10 PM",
  },
];

export const bentonCurrentlyHotLeadsData: LeadRow[] = [
  {
    lead: "Follow Up",
    companyName: "Atlas Freight",
    fullName: "Sadia Rahman",
    phone: "+1 303 555 0192",
    email: "sadia@atlasfreight.com",
    timezone: "CST",
    contactType: "Prospecting",
    svgLeadType: "General",
    svgToBeCalledBy: "Asha",
    svgLastCallDate: "2026-04-11",
    bentonLeadType: "Warm",
    bentonToBeCalledBy: "Tanvir",
    bentonLastCallDate: "2026-04-10",
    rm95LeadType: "Cold",
    rm95ToBeCalledBy: "Nafis",
    rm95LastCallDate: "2026-04-08",
    svgDateBecomeHot: "2026-04-09",
    bentonDateBecomeHot: "2026-04-09",
    rm95DateBecomeHot: "2026-04-07",
    lastActionDate: "2026-04-11 09:45 AM",
  },
  {
    lead: "Re-Engaged",
    companyName: "Vertex Commerce",
    fullName: "Imran Ali",
    phone: "+1 617 555 0114",
    email: "imran@vertexcommerce.com",
    timezone: "GMT",
    contactType: "No Answer",
    svgLeadType: "Warm",
    svgToBeCalledBy: "Asha",
    svgLastCallDate: "2026-04-10",
    bentonLeadType: "Warm",
    bentonToBeCalledBy: "Tanvir",
    bentonLastCallDate: "2026-04-09",
    rm95LeadType: "General",
    rm95ToBeCalledBy: "Hasib",
    rm95LastCallDate: "2026-04-06",
    svgDateBecomeHot: "2026-04-08",
    bentonDateBecomeHot: "2026-04-07",
    rm95DateBecomeHot: "2026-04-05",
    lastActionDate: "2026-04-10 04:40 PM",
  },
  {
    lead: "Qualified",
    companyName: "Harbor Ledger",
    fullName: "Grace Miller",
    phone: "+1 212 555 0129",
    email: "grace@harborledger.com",
    timezone: "EST",
    contactType: "Call Lead Back",
    svgLeadType: "Hot",
    svgToBeCalledBy: "Nafis",
    svgLastCallDate: "2026-04-16",
    bentonLeadType: "Referral",
    bentonToBeCalledBy: "Maliha",
    bentonLastCallDate: "2026-04-14",
    rm95LeadType: "Warm",
    rm95ToBeCalledBy: "Rafi",
    rm95LastCallDate: "2026-04-13",
    svgDateBecomeHot: "2026-04-15",
    bentonDateBecomeHot: "2026-04-14",
    rm95DateBecomeHot: "2026-04-12",
    lastActionDate: "2026-04-16 08:55 AM",
  },
  {
    lead: "Hot Lead",
    companyName: "Evercore Media",
    fullName: "Sophia Turner",
    phone: "+44 20 7946 0132",
    email: "sophia@evercoremedia.co.uk",
    timezone: "GMT",
    contactType: "Interested",
    svgLeadType: "Warm",
    svgToBeCalledBy: "Hasib",
    svgLastCallDate: "2026-04-17",
    bentonLeadType: "Hot",
    bentonToBeCalledBy: "Tanvir",
    bentonLastCallDate: "2026-04-16",
    rm95LeadType: "Referral",
    rm95ToBeCalledBy: "Asha",
    rm95LastCallDate: "2026-04-15",
    svgDateBecomeHot: "2026-04-17",
    bentonDateBecomeHot: "2026-04-16",
    rm95DateBecomeHot: "2026-04-14",
    lastActionDate: "2026-04-17 02:25 PM",
  },
];

export const rm95CurrentlyHotLeadsData: LeadRow[] = [
  {
    lead: "On Interested",
    companyName: "PixelMint Studio",
    fullName: "Jon Mercer",
    phone: "+1 646 555 0177",
    email: "jon@pixelmint.co",
    timezone: "MST",
    contactType: "Left Message",
    svgLeadType: "Cold",
    svgToBeCalledBy: "Hasib",
    svgLastCallDate: "2026-04-13",
    bentonLeadType: "Cold",
    bentonToBeCalledBy: "Rafi",
    bentonLastCallDate: "2026-04-10",
    rm95LeadType: "Cold",
    rm95ToBeCalledBy: "Tanvir",
    rm95LastCallDate: "2026-04-12",
    svgDateBecomeHot: "2026-04-09",
    bentonDateBecomeHot: "2026-04-08",
    rm95DateBecomeHot: "2026-04-08",
    lastActionDate: "2026-04-13 01:20 PM",
  },
  {
    lead: "Qualified",
    companyName: "Transit Core",
    fullName: "Victor Lopez",
    phone: "+34 91 555 0130",
    email: "victor@transitcore.es",
    timezone: "CET",
    contactType: "Interested",
    svgLeadType: "Hot",
    svgToBeCalledBy: "Nafis",
    svgLastCallDate: "2026-04-18",
    bentonLeadType: "Warm",
    bentonToBeCalledBy: "Maliha",
    bentonLastCallDate: "2026-04-16",
    rm95LeadType: "Hot",
    rm95ToBeCalledBy: "Nafis",
    rm95LastCallDate: "2026-04-18",
    svgDateBecomeHot: "2026-04-16",
    bentonDateBecomeHot: "2026-04-15",
    rm95DateBecomeHot: "2026-04-17",
    lastActionDate: "2026-04-18 05:05 PM",
  },
  {
    lead: "Follow Up",
    companyName: "Orbit Analytics",
    fullName: "Priya Sen",
    phone: "+91 80 5555 0198",
    email: "priya@orbitanalytics.in",
    timezone: "IST",
    contactType: "Call Lead Back",
    svgLeadType: "Referral",
    svgToBeCalledBy: "Asha",
    svgLastCallDate: "2026-04-13",
    bentonLeadType: "General",
    bentonToBeCalledBy: "Rafi",
    bentonLastCallDate: "2026-04-12",
    rm95LeadType: "Referral",
    rm95ToBeCalledBy: "Asha",
    rm95LastCallDate: "2026-04-13",
    svgDateBecomeHot: "2026-04-12",
    bentonDateBecomeHot: "2026-04-11",
    rm95DateBecomeHot: "2026-04-11",
    lastActionDate: "2026-04-13 07:35 PM",
  },
  {
    lead: "Interested",
    companyName: "Apex Imports",
    fullName: "Hiro Tanaka",
    phone: "+81 3 5550 0120",
    email: "hiro@apeximports.jp",
    timezone: "JST",
    contactType: "Interested",
    svgLeadType: "Warm",
    svgToBeCalledBy: "Hasib",
    svgLastCallDate: "2026-04-12",
    bentonLeadType: "Warm",
    bentonToBeCalledBy: "Tanvir",
    bentonLastCallDate: "2026-04-11",
    rm95LeadType: "Warm",
    rm95ToBeCalledBy: "Hasib",
    rm95LastCallDate: "2026-04-12",
    svgDateBecomeHot: "2026-04-11",
    bentonDateBecomeHot: "2026-04-10",
    rm95DateBecomeHot: "2026-04-10",
    lastActionDate: "2026-04-12 10:05 AM",
  },
];

export const currentlyHotLeadsDataByCompany = {
  SVG: svgCurrentlyHotLeadsData,
  Benton: bentonCurrentlyHotLeadsData,
  "95RM": rm95CurrentlyHotLeadsData,
} as const;

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

export function getCompanySymbolOptions(rows: LeadRow[]): string[] {
  return Array.from(new Set(rows.map((row) => getCompanySymbol(row.companyName))));
}
