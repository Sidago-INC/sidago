"use client";

import { useQuery } from "@tanstack/react-query";
import type { ClosedContactRow } from "./data";

type Brand = "svg" | "95rm" | "benton";
type Category = "current" | "historical" | "all";

type ApiResponse =
  | { ok: true; count: number; data: ClosedContactRow[] }
  | { ok: false; error: string };

async function fetchClosedContracts(
  category: Category,
  brand?: Brand,
): Promise<ClosedContactRow[]> {
  const params = new URLSearchParams({ category });
  if (brand) params.set("brand", brand);
  const res = await fetch(`/api/reports/closed-contracts?${params.toString()}`);
  const json = (await res.json()) as ApiResponse;

  if (!res.ok || !json.ok) {
    const message = "error" in json ? json.error : `HTTP ${res.status}`;
    throw new Error(message);
  }

  return json.data;
}

export function useClosedContracts(category: Category, brand?: Brand) {
  return useQuery({
    queryKey: ["closed-contracts", category, brand ?? "all"],
    queryFn: () => fetchClosedContracts(category, brand),
    staleTime: 30_000,
  });
}
