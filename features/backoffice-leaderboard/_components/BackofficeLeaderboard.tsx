"use client";

import { CompanySymbolBadge, StatusCard } from "@/components/ui";
import clsx from "clsx";
import { backofficeLeaderboardAgents } from "../_lib/data";

const CARD_TONES = [
  "bg-indigo-50 dark:bg-indigo-950/30",
  "bg-emerald-50 dark:bg-emerald-950/30",
  "bg-amber-50 dark:bg-amber-950/30",
  "bg-rose-50 dark:bg-rose-950/30",
];

export function BackofficeLeaderboard() {
  return (
    <main className="min-h-full p-6 md:p-8">
      <section className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-black/20 md:p-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
            Backoffice Leaderboard
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Daily leaderboard snapshot for the backoffice team.
          </p>
        </div>

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
      </section>
    </main>
  );
}
