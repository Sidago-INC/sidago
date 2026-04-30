"use client";

import { useQuery } from "@tanstack/react-query";

type Brand = "svg" | "95rm" | "benton";

export type AgentUser = {
  id: string;
  name: string;
  email: string;
};

type ApiResponse =
  | { ok: true; count: number; data: AgentUser[] }
  | { ok: false; error: string };

async function fetchAgents(brand: Brand): Promise<AgentUser[]> {
  const res = await fetch(`/api/users?brand=${brand}`);
  const json = (await res.json()) as ApiResponse;
  if (!res.ok || !json.ok) {
    const msg = "error" in json ? json.error : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json.data;
}

// Returns calling agents assigned to a brand. Cached for 5 minutes since
// the agent roster rarely changes during a working session.
export function useUsers(brand: Brand) {
  return useQuery({
    queryKey: ["agents", brand],
    queryFn: () => fetchAgents(brand),
    staleTime: 5 * 60_000,
  });
}
