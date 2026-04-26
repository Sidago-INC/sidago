import { DeadMissingEmail } from "@/features/dead-missing-email/_components/DeadMissingEmail";

export const metadata = {
  title: "Dead/Missing Email | Sidago CRM",
  description: "Review and repair leads with dead or missing email addresses.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <DeadMissingEmail />;
}
