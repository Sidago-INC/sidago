import { UnassignedHotLeadsSvg } from "@/features/backoffice-unassigned-hot-leads/_components/UnassignedHotLeadsSvg";
import React from "react";

export const metadata = {
  title: "Unassigned Hot Leads SVG | Sidago CRM",
  description:
    "Sidago CRM is a secure and scalable customer relationship management platform designed to help businesses manage leads, track interactions, and build stronger customer connections with ease.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return <UnassignedHotLeadsSvg />;
}
