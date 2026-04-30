import DashboardSwitch from "@/features/dashboard/_components/DashboardSwitch";

export const metadata = {
  title: "Dashboard | Sidago CRM",
  description: "Dashboard for Sidago CRM.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardSwitch />;
}
