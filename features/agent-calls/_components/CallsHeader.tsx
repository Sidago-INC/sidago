"use client";

import { Button } from "@/components/ui";
import { Select } from "@/components/ui/Select";
import { Lead } from "@/types";
import { Phone, SkipForward } from "lucide-react";

type CallsHeaderProps = {
  leads: Lead[];
  currentIndex: number;
  onSelectLead: (value: number) => void;
  onSkip: () => void;
};

export function CallsHeader({
  leads,
  currentIndex,
  onSelectLead,
  onSkip,
}: CallsHeaderProps) {
  const leadOptions = leads.map((lead, index) => ({
    value: index,
    label: lead.lead_id || lead.full_name,
  }));

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="mr-2 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-600">
              <Phone className="h-4 w-4 text-white" />
            </div>
            <span className="hidden text-sm font-semibold text-slate-800 dark:text-gray-100 sm:block">
              Call UI
            </span>
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-gray-700" />

          <div className="flex min-w-0 items-center gap-2">
            <label className="whitespace-nowrap text-xs font-medium text-slate-400 dark:text-gray-500">
              Lead
            </label>
            <Select
              value={currentIndex}
              options={leadOptions}
              placeholder="Select lead"
              onChange={(event) => onSelectLead(Number(event.target.value))}
              className="max-w-55 cursor-pointer truncate rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 transition focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            />
            <span className="whitespace-nowrap text-xs font-medium text-slate-400 dark:text-gray-500">
              {currentIndex + 1} / {leads.length}
            </span>
          </div>
        </div>

        <Button
          onClick={onSkip}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
        >
          Skip
          <SkipForward className="h-3.5 w-3.5" />
        </Button>
      </div>
    </header>
  );
}
