"use client";

import { CompanySymbolBadge, StatusCard } from "@/components/ui";
import clsx from "clsx";
import { WinnerBadge } from "@/features/agent-dashboard/_components/WinnerBadge";
import { backofficeLeaderboardAgents, todayWinner } from "../_lib/data";

const CARD_TONES = [
  "bg-indigo-50 dark:bg-indigo-950/30",
  "bg-emerald-50 dark:bg-emerald-950/30",
  "bg-amber-50 dark:bg-amber-950/30",
  "bg-rose-50 dark:bg-rose-950/30",
];

export function BackofficeDashboard() {
  return (
    <main className="min-h-full p-6 md:p-8">
      <div className="space-y-6">
        <StatusCard
          className="border-slate-200 dark:border-slate-800 dark:bg-slate-900"
          header={
            <div className="flex items-center gap-3">
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-slate-900 dark:text-slate-100">
                  Today Winner
                </p>
              </div>
            </div>
          }
          aside={<WinnerBadge label={todayWinner.name} />}
          metrics={[
            {
              id: "calls-today",
              label: "Calls Today",
              value: todayWinner.callsToday,
              className: clsx("rounded-xl px-4 py-3", CARD_TONES[0]),
              valueClassName:
                "text-xl font-bold text-slate-900 dark:text-slate-100",
            },
            {
              id: "hot-leads-today",
              label: "Hot Leads Today",
              value: todayWinner.hotLeadsToday,
              className: clsx("rounded-xl px-4 py-3", CARD_TONES[0]),
              valueClassName:
                "text-xl font-bold text-slate-900 dark:text-slate-100",
            },
            {
              id: "current-hot-leads",
              label: "Current Hot Leads",
              value: todayWinner.currentHotLeads,
              className: clsx("rounded-xl px-4 py-3", CARD_TONES[0]),
              valueClassName:
                "text-xl font-bold text-slate-900 dark:text-slate-100",
            },
          ]}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2 xxl:grid-cols-3">
          {backofficeLeaderboardAgents.map((agent, index) => (
            <StatusCard
              key={agent.id}
              className="border-slate-200 dark:border-slate-800 dark:bg-slate-900"
              header={
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                    {agent.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold text-slate-900 dark:text-slate-100">
                      {agent.name}
                    </p>
                    <div className="pt-1">
                      <CompanySymbolBadge symbol={agent.team} index={index} />
                    </div>
                  </div>
                </div>
              }
              metrics={[
                {
                  id: "calls-today",
                  label: "Calls Today",
                  value: agent.callsToday,
                  className: clsx("rounded-xl px-4 py-3", CARD_TONES[index]),
                  valueClassName:
                    "text-xl font-bold text-slate-900 dark:text-slate-100",
                },
                {
                  id: "hot-leads-today",
                  label: "Hot Leads Today",
                  value: agent.hotLeadsToday,
                  className: clsx("rounded-xl px-4 py-3", CARD_TONES[index]),
                  valueClassName:
                    "text-xl font-bold text-slate-900 dark:text-slate-100",
                },
                {
                  id: "current-hot-leads",
                  label: "Current Hot Leads",
                  value: agent.currentHotLeads,
                  className: clsx("rounded-xl px-4 py-3", CARD_TONES[index]),
                  valueClassName:
                    "text-xl font-bold text-slate-900 dark:text-slate-100",
                },
              ]}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
