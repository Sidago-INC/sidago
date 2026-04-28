import { AddCompanyForm } from "@/features/companies/_components/AddCompanyForm";

export const metadata = {
  title: "Add Company | Sidago CRM",
  description:
    "Create a new company record in Sidago CRM and continue managing it from the companies directory.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AddCompanyForm />;
}
