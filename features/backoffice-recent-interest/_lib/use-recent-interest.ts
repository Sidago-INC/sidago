"use client";

import { useQuery } from "@tanstack/react-query";
import type { RecentInterestRow } from "./data";

type Brand = "svg" | "95rm" | "benton";

type ApiResponse =
  | { ok: true; count: number; data: RecentInterestRow[] }
  | { ok: false; error: string };

async function fetchRecentInterest(brand: Brand): Promise<RecentInterestRow[]> {
  const res = await fetch(`/api/reports/recent-interest?brand=${brand}`);
  const json = (await res.json()) as ApiResponse;

  if (!res.ok || !json.ok) {
    const message = "error" in json ? json.error : `HTTP ${res.status}`;
    throw new Error(message);
  }

  return json.data;
}

export function useRecentInterest(brand: Brand) {
  return useQuery({
    queryKey: ["recent-interest", brand],
    queryFn: () => fetchRecentInterest(brand),
    staleTime: 30_000,
  });
}
