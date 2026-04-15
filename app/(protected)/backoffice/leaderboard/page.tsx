import { BackofficeLeaderboard } from "@/features/backoffice-leaderboard/_components/BackofficeLeaderboard";
import React from "react";

export const metadata = {
  title: "Backoffice Leaderboard | Sidago CRM",
  description:
    "Sidago CRM is a secure and scalable customer relationship management platform designed to help businesses manage leads, track interactions, and build stronger customer connections with ease.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return <BackofficeLeaderboard />;
}
