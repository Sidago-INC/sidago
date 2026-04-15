"use client";
import { HasRole } from "@/components/guards/HasRole";
import AgentDashboard from "@/features/agent-dashboard/AgentDashboard";

export default function Dashboard() {
  return (
    <HasRole name="agent">
      <AgentDashboard />
    </HasRole>
  );
}
