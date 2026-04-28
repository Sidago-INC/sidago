import { FixLeads } from "@/features/fix-leads/_components/FixLeads";

export const metadata = {
  title: "Fix Leads | Sidago CRM",
  description:
    "Review fix queue leads and switch into 24-hour lead fix activity views.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <FixLeads />;
}
