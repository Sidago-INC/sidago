import { getLeadId } from "@/features/backoffice-shared/constants";
import { generateHotLeadRows } from "@/features/backoffice-shared/lead-mapper";

export const EMAIL_PRIORITY_VALUES = ["1st", "2nd", "3rd", "4th", "5th"] as const;

export type EmailPriority = (typeof EMAIL_PRIORITY_VALUES)[number];

export type AgentEmailRow = {
  id: string;
  leadId: string;
  fullName: string;
  email: string;
  emailToBeSent: EmailPriority;
  history: string;
  checkToLog: boolean;
  missingDeadEmail: boolean;
  additionalEmails: string;
};

const histories = [
  "Intro email queued after recent interest.",
  "Follow-up email drafted after call attempt.",
  "Reactivation email scheduled for this week.",
  "Manual review requested before sending.",
  "Previous email opened, no reply yet.",
];

function buildAdditionalEmails(email: string, index: number) {
  const [name, domain] = email.split("@");
  return `${name}+alt${index + 1}@${domain}`;
}

export function getEmailRowsForAgent(agentSlug: string): AgentEmailRow[] {
  return generateHotLeadRows(12).map((lead, index) => ({
    id: `${agentSlug}-email-${index + 1}`,
    leadId: getLeadId(lead),
    fullName: lead.fullName,
    email: lead.email,
    emailToBeSent: EMAIL_PRIORITY_VALUES[index % EMAIL_PRIORITY_VALUES.length],
    history: histories[index % histories.length],
    checkToLog: index % 2 === 0,
    missingDeadEmail: index % 5 === 0,
    additionalEmails: buildAdditionalEmails(lead.email, index),
  }));
}

export const emailPriorityOptions = EMAIL_PRIORITY_VALUES.map((value) => ({
  label: value,
  value,
}));
