import { BulkCompanyImport } from "@/features/companies/_components/BulkCompanyImport";

export const metadata = {
  title: "Bulk Company Import | Sidago CRM",
  description:
    "Upload an XLSX file to import multiple companies into Sidago CRM at once.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <BulkCompanyImport />;
}
