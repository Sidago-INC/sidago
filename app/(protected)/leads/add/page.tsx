import { AddLeadForm } from "@/features/leads/_components/AddLeadForm";

export const metadata = {
  title: "Add Lead | Sidago CRM",
  description:
    "Create a new lead record in Sidago CRM and continue managing it from the leads directory.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AddLeadForm />;
}
