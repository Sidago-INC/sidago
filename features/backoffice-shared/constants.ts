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

export function getLeadId(row: { companyName: string; lead: string }): string {
  const companySymbol = getCompanySymbol(row.companyName);

  if (!companySymbol) {
    return row.lead;
  }

  if (!row.lead) {
    return companySymbol;
  }

  return `${companySymbol}-${row.lead}`;
}

export function getCompanySymbolOptions(
  rows: { companyName: string }[],
): string[] {
  return Array.from(
    new Set(rows.map((row) => getCompanySymbol(row.companyName))),
  );
}

export function getLeadIdOptions(
  rows: { companyName: string; lead: string }[],
): string[] {
  return Array.from(new Set(rows.map((row) => getLeadId(row))));
}
