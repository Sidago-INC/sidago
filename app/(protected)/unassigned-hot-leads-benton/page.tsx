import { UnassignedHotLeadsBenton } from "@/features/backoffice-unassigned-hot-leads/_components/UnassignedHotLeadsBenton";
import React from "react";

export const metadata = {
  title: "Unassigned Hot Leads Benton | Sidago CRM",
  description:
    "Sidago CRM is a secure and scalable customer relationship management platform designed to help businesses manage leads, track interactions, and build stronger customer connections with ease.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <UnassignedHotLeadsBenton />;
}
