import { AgentEmail } from "@/features/agent-email/_components/AgentEmail";

export const metadata = {
  title: "Email - Bryan Taylor | Sidago CRM",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AgentEmail agentName="Bryan Taylor" agentSlug="bryan-taylor" />;
}
