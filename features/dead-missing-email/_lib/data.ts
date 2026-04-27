import { getLeadId } from "@/features/backoffice-shared/constants";
import { generateRandomLeads, type LEAD } from "@/types/lead.types";

export type DeadMissingEmailStatus = "Needs Review" | "Updated" | "Unresolvable";

export type DeadMissingEmailRow = {
  id: string;
  leadId: string;
  email: string;
  additionalContactEmails: string;
  leadType: string;
  bentonLeadType: string;
  rm95LeadType: string;
  missingDeadEmail: boolean;
  status: DeadMissingEmailStatus;
  companyName: string;
  fullName: string;
};

function createAdditionalContactEmails(lead: LEAD, index: number) {
  const fallbackName = lead.full_name?.toLowerCase().replace(/\s+/g, ".") ?? "contact";
  const companySlug =
    lead.company?.name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16) ||
    "company";

  if (index % 4 === 0) {
    return "";
  }

  return [
    lead.additional_contacts,
    lead.additonal_contacts,
    `${fallbackName}.assistant@${companySlug}.com`,
  ]
    .filter(Boolean)
    .join(", ");
}

function mapLeadToDeadMissingEmailRow(
  lead: LEAD,
  index: number,
): DeadMissingEmailRow {
  const companyName = lead.company?.name ?? "";
  const isMissing = index % 5 === 0;
  const isDead = lead["missing/dead_email"] ?? false;

  return {
    id: String(lead.id ?? lead.record_id ?? index),
    leadId: lead.lead_id || getLeadId({ companyName, lead: lead.lead ?? "" }),
    email: isMissing ? "" : (lead.email ?? ""),
    additionalContactEmails: "",
    leadType: lead.lead_type ?? "",
    bentonLeadType: lead.lead_type_benton ?? "",
    rm95LeadType: lead.lead_type_95rm ?? "",
    missingDeadEmail: isMissing || isDead,
    status: "Needs Review",
    companyName,
    fullName: lead.full_name ?? "",
  };
}

export const deadMissingEmailRows: DeadMissingEmailRow[] = generateRandomLeads(18)
  .map(mapLeadToDeadMissingEmailRow)
  .filter((row) => row.missingDeadEmail || !row.email);
