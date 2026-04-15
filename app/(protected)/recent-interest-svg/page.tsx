import { RecentInterestSvg } from "@/features/backoffice-recent-interest/_components/RecentInterestSvg";
import React from "react";

export const metadata = {
  title: "Recent Interest SVG | Sidago CRM",
  description:
    "Sidago CRM is a secure and scalable customer relationship management platform designed to help businesses manage leads, track interactions, and build stronger customer connections with ease.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return <RecentInterestSvg />;
}
