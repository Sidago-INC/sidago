import { AgentEmail } from "@/features/agent-email/_components/AgentEmail";

export const metadata = {
  title: "Email - Tom Silver | Sidago CRM",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AgentEmail agentName="Tom Silver" agentSlug="tom-silver" />;
}
