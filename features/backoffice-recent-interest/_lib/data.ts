export type RecentInterestRow = {
  followUpDateCleaned: string;
  lead: string;
  campaignType: string;
  contactPerson: string;
  companyName: string;
  email: string;
  assignedTo: string;
  callResult: string;
  leadType: string;
  notes: string;
  phone: string;
};

export const recentInterestLeadOptions = [
  "Interested",
  "Qualified",
  "Follow Up",
  "Re-Engaged",
  "Hot Lead",
];

export const recentInterestCampaignOptions = [
  "Current Interest",
  "Reactivation",
  "Inbound",
  "Outbound",
  "Referral",
];

export const recentInterestAssigneeOptions = [
  "Hasib",
  "Nafis",
  "Asha",
  "Rafi",
  "Maliha",
  "Tanvir",
];

export const recentInterestCallResultOptions = [
  "Interested",
  "Call Lead Back",
  "No Answer",
  "Left Message",
  "Meeting Booked",
  "Qualified",
];

export const recentInterestLeadTypeOptions = [
  "Hot",
  "Warm",
  "Cold",
  "General",
  "Referral",
];

export const svgRecentInterestData: RecentInterestRow[] = [
  {
    followUpDateCleaned: "2026-04-17",
    lead: "Interested",
    campaignType: "Current Interest",
    contactPerson: "Ariana West",
    companyName: "Northwind Labs",
    email: "ariana@northwind.io",
    assignedTo: "Hasib",
    callResult: "Meeting Booked",
    leadType: "Hot",
    notes: "Requested pricing deck and a follow-up call next week.",
    phone: "+1 415 221 0901",
  },
  {
    followUpDateCleaned: "2026-04-18",
    lead: "Qualified",
    campaignType: "Inbound",
    contactPerson: "Rayan Chowdhury",
    companyName: "BluePeak Digital",
    email: "rayan@bluepeak.com",
    assignedTo: "Nafis",
    callResult: "Qualified",
    leadType: "Warm",
    notes: "Needs team access details before moving to proposal stage.",
    phone: "+1 202 555 0188",
  },
  {
    followUpDateCleaned: "2026-04-19",
    lead: "Follow Up",
    campaignType: "Reactivation",
    contactPerson: "Nabila Ahmed",
    companyName: "BrightPath Health",
    email: "nabila@brightpath.health",
    assignedTo: "Maliha",
    callResult: "Call Lead Back",
    leadType: "Warm",
    notes: "Asked to reconnect after internal budget review on Friday.",
    phone: "+1 718 555 0133",
  },
  {
    followUpDateCleaned: "2026-04-20",
    lead: "Re-Engaged",
    campaignType: "Referral",
    contactPerson: "Laura Chen",
    companyName: "Summit Freight",
    email: "laura@summitfreight.com",
    assignedTo: "Rafi",
    callResult: "Interested",
    leadType: "Referral",
    notes: "Referral source confirmed; waiting on warehouse volume estimate.",
    phone: "+1 206 555 0107",
  },
];

export const rm95RecentInterestData: RecentInterestRow[] = [
  {
    followUpDateCleaned: "2026-04-16",
    lead: "Follow Up",
    campaignType: "Current Interest",
    contactPerson: "Jon Mercer",
    companyName: "PixelMint Studio",
    email: "jon@pixelmint.co",
    assignedTo: "Tanvir",
    callResult: "Left Message",
    leadType: "Cold",
    notes: "Voicemail left with offer summary and callback number.",
    phone: "+1 646 555 0177",
  },
  {
    followUpDateCleaned: "2026-04-18",
    lead: "Qualified",
    campaignType: "Inbound",
    contactPerson: "Victor Lopez",
    companyName: "Transit Core",
    email: "victor@transitcore.es",
    assignedTo: "Nafis",
    callResult: "Meeting Booked",
    leadType: "Hot",
    notes: "Booked product walkthrough with ops director for Monday.",
    phone: "+34 91 555 0130",
  },
  {
    followUpDateCleaned: "2026-04-17",
    lead: "Interested",
    campaignType: "Outbound",
    contactPerson: "Priya Sen",
    companyName: "Orbit Analytics",
    email: "priya@orbitanalytics.in",
    assignedTo: "Asha",
    callResult: "Call Lead Back",
    leadType: "Referral",
    notes: "Asked for a callback after discussing with procurement.",
    phone: "+91 80 5555 0198",
  },
  {
    followUpDateCleaned: "2026-04-19",
    lead: "Hot Lead",
    campaignType: "Reactivation",
    contactPerson: "Hiro Tanaka",
    companyName: "Apex Imports",
    email: "hiro@apeximports.jp",
    assignedTo: "Hasib",
    callResult: "Interested",
    leadType: "Warm",
    notes: "Reopened conversation after seeing updated pricing offer.",
    phone: "+81 3 5550 0120",
  },
];

export const bentonRecentInterestData: RecentInterestRow[] = [
  {
    followUpDateCleaned: "2026-04-17",
    lead: "Follow Up",
    campaignType: "Current Interest",
    contactPerson: "Sadia Rahman",
    companyName: "Atlas Freight",
    email: "sadia@atlasfreight.com",
    assignedTo: "Tanvir",
    callResult: "Call Lead Back",
    leadType: "Warm",
    notes: "Requested a callback after checking fleet scheduling gaps.",
    phone: "+1 303 555 0192",
  },
  {
    followUpDateCleaned: "2026-04-18",
    lead: "Re-Engaged",
    campaignType: "Reactivation",
    contactPerson: "Imran Ali",
    companyName: "Vertex Commerce",
    email: "imran@vertexcommerce.com",
    assignedTo: "Hasib",
    callResult: "Interested",
    leadType: "General",
    notes: "Returned after prior inactivity and asked for case studies.",
    phone: "+1 617 555 0114",
  },
  {
    followUpDateCleaned: "2026-04-19",
    lead: "Qualified",
    campaignType: "Referral",
    contactPerson: "Grace Miller",
    companyName: "Harbor Ledger",
    email: "grace@harborledger.com",
    assignedTo: "Maliha",
    callResult: "Qualified",
    leadType: "Referral",
    notes: "Referral intro completed; solution fit confirmed on the call.",
    phone: "+1 212 555 0129",
  },
  {
    followUpDateCleaned: "2026-04-21",
    lead: "Hot Lead",
    campaignType: "Inbound",
    contactPerson: "Sophia Turner",
    companyName: "Evercore Media",
    email: "sophia@evercoremedia.co.uk",
    assignedTo: "Rafi",
    callResult: "Meeting Booked",
    leadType: "Hot",
    notes: "Booked next-step demo with decision-makers from marketing.",
    phone: "+44 20 7946 0132",
  },
];
