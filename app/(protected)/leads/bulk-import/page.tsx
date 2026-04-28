import { BulkLeadImport } from "@/features/leads/_components/BulkLeadImport";

export const metadata = {
  title: "Bulk Lead Import | Sidago CRM",
  description:
    "Upload an XLSX file to import multiple leads into Sidago CRM at once.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <BulkLeadImport />;
}
