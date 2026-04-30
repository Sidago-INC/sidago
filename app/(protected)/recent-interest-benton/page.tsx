import { RecentInterestBenton } from "@/features/backoffice-recent-interest/_components/RecentInterestBenton";
import React from "react";

export const metadata = {
  title: "Recent Interest Benton | Sidago CRM",
  description:
    "Sidago CRM is a secure and scalable customer relationship management platform designed to help businesses manage leads, track interactions, and build stronger customer connections with ease.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <RecentInterestBenton />;
}
