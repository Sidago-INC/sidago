import { Leads } from "@/features/leads/_components/Leads";

export const metadata = {
  title: "Leads | Sidago CRM",
  description:
    "Browse, review, and update all lead records across SVG, Benton, and 95RM in Sidago CRM.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <Leads />;
}
