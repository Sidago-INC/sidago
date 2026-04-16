import { EverBeenHotBenton } from "@/features/backoffice-ever-been-hot/_components/EverBeenHotBenton";
import React from "react";

export const metadata = {
  title: "Ever Been Hot Benton | Sidago CRM",
  description:
    "Sidago CRM is a secure and scalable customer relationship management platform designed to help businesses manage leads, track interactions, and build stronger customer connections with ease.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <EverBeenHotBenton />;
}
