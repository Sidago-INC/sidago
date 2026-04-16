import { BackofficeDashboard } from "@/features/backoffice-dashboard/_components/BackofficeDashboard";
import React from "react";

export const metadata = {
  title: "Monthly Stats & Points | Sidago CRM",
  description:
    "Sidago CRM is a secure and scalable customer relationship management platform designed to help businesses manage leads, track interactions, and build stronger customer connections with ease.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <BackofficeDashboard initialView="monthly" />;
}
