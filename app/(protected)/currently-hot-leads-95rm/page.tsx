import { CurrentlyHot95rm } from "@/features/backoffice-currently-hot/_components/CurrentlyHot95rm";
import React from "react";

export const metadata = {
  title: "Currently Hot Leads 95RM | Sidago CRM",
  description:
    "Sidago CRM is a secure and scalable customer relationship management platform designed to help businesses manage leads, track interactions, and build stronger customer connections with ease.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return <CurrentlyHot95rm />;
}
