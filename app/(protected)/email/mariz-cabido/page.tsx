import { AgentEmail } from "@/features/agent-email/_components/AgentEmail";

export const metadata = {
  title: "Email - Mariz Cabido | Sidago CRM",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AgentEmail agentName="Mariz Cabido" agentSlug="mariz-cabido" />;
}
