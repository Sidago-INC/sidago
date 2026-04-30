"use client";

import { useQuery } from "@tanstack/react-query";
import type { HotLeadRow } from "@/features/backoffice-shared/types";

type Brand = "svg" | "95rm" | "benton";

type ApiResponse =
  | { ok: true; count: number; data: HotLeadRow[] }
  | { ok: false; error: string };

async function fetchCurrentlyHot(brand: Brand): Promise<HotLeadRow[]> {
  const res = await fetch(`/api/reports/currently-hot?brand=${brand}`);
  const json = (await res.json()) as ApiResponse;

  if (!res.ok || !json.ok) {
    const message = "error" in json ? json.error : `HTTP ${res.status}`;
    throw new Error(message);
  }

  return json.data;
}

export function useCurrentlyHot(brand: Brand) {
  return useQuery({
    queryKey: ["currently-hot", brand],
    queryFn: () => fetchCurrentlyHot(brand),
    staleTime: 30_000,
  });
}
