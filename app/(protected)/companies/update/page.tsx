import { Companies } from "@/features/companies/_components/Companies";

export const metadata = {
  title: "Companies | Sidago CRM",
  description:
    "Manage company profiles, market details, locations, and primary web contacts in Sidago CRM.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <Companies />;
}
