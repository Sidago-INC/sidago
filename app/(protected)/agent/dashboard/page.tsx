import Dashboard from "../../dashboard/components/Dashboard";

export const metadata = {
  title: "Agent Dashboard | Sidago CRM",
  description: "Agent dashboard for Sidago CRM.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AgentDashboardPage() {
  return <Dashboard />;
}
