"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

type Brand = "svg" | "95rm" | "benton";

export type LeadPatchBody = {
  lead?: {
    full_name?: string;
    phone?: string;
    email?: string;
    role?: string;
    contact_type?: string;
    not_work_anymore?: boolean;
    company_name?: string;
  };
  brandStates?: Partial<
    Record<
      Brand,
      {
        lead_type?: string;
        to_be_called_by?: string | null;
        last_called_date?: string | null;
      }
    >
  >;
};

type PatchResponse =
  | { ok: true; leadId: string; updated: { lead: number; brandStates: Record<string, number> } }
  | { ok: false; error: string };

async function patchLead(leadId: string, body: LeadPatchBody) {
  const res = await fetch(`/api/leads/${leadId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as PatchResponse;
  if (!res.ok || !json.ok) {
    const msg = "error" in json ? json.error : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, body }: { leadId: string; body: LeadPatchBody }) =>
      patchLead(leadId, body),
    onSuccess: () => {
      // A single lead edit can affect any of the report views, so invalidate
      // all of them. Cheap because invalidation only triggers refetches for
      // queries currently mounted on the screen.
      qc.invalidateQueries({ queryKey: ["currently-hot"] });
      qc.invalidateQueries({ queryKey: ["unassigned-hot"] });
      qc.invalidateQueries({ queryKey: ["ever-been-hot"] });
      qc.invalidateQueries({ queryKey: ["recent-interest"] });
      qc.invalidateQueries({ queryKey: ["closed-contracts"] });
    },
  });
}
