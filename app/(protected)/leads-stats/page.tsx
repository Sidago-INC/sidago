import { LeadsStats } from "@/features/leads-stats/_components/LeadsStats";

export const metadata = {
  title: "Leads Stats | Sidago CRM",
  description:
    "Track lead totals, queue coverage, and contact-data quality across stored CRM leads.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <LeadsStats />;
}
