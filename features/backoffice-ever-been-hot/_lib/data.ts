export type EverBeenHotRow = {
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

export const everBeenHotSvgData: EverBeenHotRow[] = [
  {
    lead: "Qualified",
    companyName: "Northwind Labs",
    fullName: "Ariana West",
    phone: "+1 415 221 0901",
    email: "ariana@northwind.io",
    timezone: "EST",
    contactType: "Interested",
    svgLeadType: "Hot",
    svgToBeCalledBy: "Hasib",
    svgLastCallDate: "2026-04-03",
    bentonLeadType: "Warm",
    bentonToBeCalledBy: "Rafi",
    bentonLastCallDate: "2026-04-02",
    rm95LeadType: "General",
    rm95ToBeCalledBy: "Tanvir",
    rm95LastCallDate: "2026-04-01",
    svgDateBecomeHot: "2026-03-28",
    bentonDateBecomeHot: "2026-03-27",
    rm95DateBecomeHot: "2026-03-24",
    lastActionDate: "2026-04-03 10:20 AM",
  },
  {
    lead: "Follow Up",
    companyName: "BluePeak Digital",
    fullName: "Rayan Chowdhury",
    phone: "+1 202 555 0188",
    email: "rayan@bluepeak.com",
    timezone: "PST",
    contactType: "Call Lead Back",
    svgLeadType: "Warm",
    svgToBeCalledBy: "Nafis",
    svgLastCallDate: "2026-04-05",
    bentonLeadType: "Hot",
    bentonToBeCalledBy: "Maliha",
    bentonLastCallDate: "2026-04-04",
    rm95LeadType: "Warm",
    rm95ToBeCalledBy: "Rafi",
    rm95LastCallDate: "2026-04-02",
    svgDateBecomeHot: "2026-03-31",
    bentonDateBecomeHot: "2026-03-30",
    rm95DateBecomeHot: "2026-03-29",
    lastActionDate: "2026-04-05 03:45 PM",
  },
  {
    lead: "Interested",
    companyName: "BrightPath Health",
    fullName: "Nabila Ahmed",
    phone: "+1 718 555 0133",
    email: "nabila@brightpath.health",
    timezone: "EST",
    contactType: "Interested",
    svgLeadType: "Referral",
    svgToBeCalledBy: "Asha",
    svgLastCallDate: "2026-04-07",
    bentonLeadType: "Warm",
    bentonToBeCalledBy: "Maliha",
    bentonLastCallDate: "2026-04-05",
    rm95LeadType: "Cold",
    rm95ToBeCalledBy: "Tanvir",
    rm95LastCallDate: "2026-04-03",
    svgDateBecomeHot: "2026-04-01",
    bentonDateBecomeHot: "2026-03-31",
    rm95DateBecomeHot: "2026-03-29",
    lastActionDate: "2026-04-07 11:15 AM",
  },
  {
    lead: "Re-Engaged",
    companyName: "Summit Freight",
    fullName: "Laura Chen",
    phone: "+1 206 555 0107",
    email: "laura@summitfreight.com",
    timezone: "PST",
    contactType: "No Answer",
    svgLeadType: "General",
    svgToBeCalledBy: "Hasib",
    svgLastCallDate: "2026-04-01",
    bentonLeadType: "Referral",
    bentonToBeCalledBy: "Rafi",
    bentonLastCallDate: "2026-03-30",
    rm95LeadType: "Referral",
    rm95ToBeCalledBy: "Maliha",
    rm95LastCallDate: "2026-03-28",
    svgDateBecomeHot: "2026-03-25",
    bentonDateBecomeHot: "2026-03-24",
    rm95DateBecomeHot: "2026-03-22",
    lastActionDate: "2026-04-01 12:30 PM",
  },
];

export const everBeenHot95rmData: EverBeenHotRow[] = [
  {
    lead: "Interested",
    companyName: "PixelMint Studio",
    fullName: "Jon Mercer",
    phone: "+1 646 555 0177",
    email: "jon@pixelmint.co",
    timezone: "MST",
    contactType: "Left Message",
    svgLeadType: "Cold",
    svgToBeCalledBy: "Hasib",
    svgLastCallDate: "2026-04-04",
    bentonLeadType: "Cold",
    bentonToBeCalledBy: "Rafi",
    bentonLastCallDate: "2026-04-01",
    rm95LeadType: "Cold",
    rm95ToBeCalledBy: "Tanvir",
    rm95LastCallDate: "2026-04-04",
    svgDateBecomeHot: "2026-03-29",
    bentonDateBecomeHot: "2026-03-28",
    rm95DateBecomeHot: "2026-03-30",
    lastActionDate: "2026-04-04 01:15 PM",
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
    svgLastCallDate: "2026-04-10",
    bentonLeadType: "Warm",
    bentonToBeCalledBy: "Maliha",
    bentonLastCallDate: "2026-04-08",
    rm95LeadType: "Hot",
    rm95ToBeCalledBy: "Nafis",
    rm95LastCallDate: "2026-04-10",
    svgDateBecomeHot: "2026-04-07",
    bentonDateBecomeHot: "2026-04-06",
    rm95DateBecomeHot: "2026-04-08",
    lastActionDate: "2026-04-10 05:05 PM",
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
    svgLastCallDate: "2026-04-06",
    bentonLeadType: "General",
    bentonToBeCalledBy: "Rafi",
    bentonLastCallDate: "2026-04-04",
    rm95LeadType: "Referral",
    rm95ToBeCalledBy: "Asha",
    rm95LastCallDate: "2026-04-06",
    svgDateBecomeHot: "2026-04-02",
    bentonDateBecomeHot: "2026-04-01",
    rm95DateBecomeHot: "2026-04-03",
    lastActionDate: "2026-04-06 07:20 PM",
  },
  {
    lead: "Hot Lead",
    companyName: "Apex Imports",
    fullName: "Hiro Tanaka",
    phone: "+81 3 5550 0120",
    email: "hiro@apeximports.jp",
    timezone: "JST",
    contactType: "Interested",
    svgLeadType: "Warm",
    svgToBeCalledBy: "Hasib",
    svgLastCallDate: "2026-04-05",
    bentonLeadType: "Warm",
    bentonToBeCalledBy: "Tanvir",
    bentonLastCallDate: "2026-04-04",
    rm95LeadType: "Warm",
    rm95ToBeCalledBy: "Hasib",
    rm95LastCallDate: "2026-04-05",
    svgDateBecomeHot: "2026-04-01",
    bentonDateBecomeHot: "2026-03-31",
    rm95DateBecomeHot: "2026-04-01",
    lastActionDate: "2026-04-05 10:10 AM",
  },
];

export const everBeenHotBentonData: EverBeenHotRow[] = [
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
    svgLastCallDate: "2026-04-02",
    bentonLeadType: "Warm",
    bentonToBeCalledBy: "Tanvir",
    bentonLastCallDate: "2026-04-03",
    rm95LeadType: "Cold",
    rm95ToBeCalledBy: "Nafis",
    rm95LastCallDate: "2026-04-01",
    svgDateBecomeHot: "2026-03-28",
    bentonDateBecomeHot: "2026-03-29",
    rm95DateBecomeHot: "2026-03-27",
    lastActionDate: "2026-04-03 09:40 AM",
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
    svgLastCallDate: "2026-04-01",
    bentonLeadType: "Warm",
    bentonToBeCalledBy: "Tanvir",
    bentonLastCallDate: "2026-04-02",
    rm95LeadType: "General",
    rm95ToBeCalledBy: "Hasib",
    rm95LastCallDate: "2026-03-30",
    svgDateBecomeHot: "2026-03-27",
    bentonDateBecomeHot: "2026-03-28",
    rm95DateBecomeHot: "2026-03-26",
    lastActionDate: "2026-04-02 04:35 PM",
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
    svgLastCallDate: "2026-04-07",
    bentonLeadType: "Referral",
    bentonToBeCalledBy: "Maliha",
    bentonLastCallDate: "2026-04-08",
    rm95LeadType: "Warm",
    rm95ToBeCalledBy: "Rafi",
    rm95LastCallDate: "2026-04-05",
    svgDateBecomeHot: "2026-04-04",
    bentonDateBecomeHot: "2026-04-05",
    rm95DateBecomeHot: "2026-04-03",
    lastActionDate: "2026-04-08 08:50 AM",
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
    svgLastCallDate: "2026-04-09",
    bentonLeadType: "Hot",
    bentonToBeCalledBy: "Tanvir",
    bentonLastCallDate: "2026-04-10",
    rm95LeadType: "Referral",
    rm95ToBeCalledBy: "Asha",
    rm95LastCallDate: "2026-04-08",
    svgDateBecomeHot: "2026-04-06",
    bentonDateBecomeHot: "2026-04-07",
    rm95DateBecomeHot: "2026-04-05",
    lastActionDate: "2026-04-10 02:20 PM",
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
  "No Answer",
  "Left Message",
  "Call Lead Back",
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

export function getCompanySymbolOptions(rows: EverBeenHotRow[]): string[] {
  return Array.from(new Set(rows.map((row) => getCompanySymbol(row.companyName))));
}
