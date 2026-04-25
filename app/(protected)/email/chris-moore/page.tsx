import { AgentEmail } from "@/features/agent-email/_components/AgentEmail";

export const metadata = {
  title: "Email - Chris Moore | Sidago CRM",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AgentEmail agentName="Chris Moore" agentSlug="chris-moore" />;
}
