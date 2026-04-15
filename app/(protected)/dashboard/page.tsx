import Dashboard from "./components/Dashboard";

export const metadata = {
  title: "Dashboard | Sidago CRM",
  description: "Dashboard for Sidago CRM.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <Dashboard />;
}
