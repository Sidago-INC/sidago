import { UnassignedHotLeads95rm } from "@/features/backoffice-unassigned-hot-leads/_components/UnassignedHotLeads95rm";
import React from "react";

export const metadata = {
  title: "Unassigned Hot Leads 95RM | Sidago CRM",
  description:
    "Sidago CRM is a secure and scalable customer relationship management platform designed to help businesses manage leads, track interactions, and build stronger customer connections with ease.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <UnassignedHotLeads95rm />;
}
