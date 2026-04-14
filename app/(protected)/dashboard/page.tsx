import RoleDashboardRedirect from "./components/RoleDashboardRedirect";

export const metadata = {
  title: "Dashboard | Sidago CRM",
  description:
    "Sidago CRM dashboard routing page that sends signed-in users to the correct dashboard for their role.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <RoleDashboardRedirect />;
}
