import { EmailBlocklistDirectory } from "@/features/email-blocklist-directory/_components/EmailBlocklistDirectory";

export const metadata = {
  title: "Email Blocklist Directory | Sidago CRM",
  description:
    "View and manage blocked or blacklisted email addresses across Sidago CRM.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <EmailBlocklistDirectory />;
}
