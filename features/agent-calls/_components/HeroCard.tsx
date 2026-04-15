import { Lead } from "@/types";
import { Building2, Clock3, BriefcaseBusiness } from "lucide-react";
import { contactTypeBadge } from "../_lib/utils";

export function HeroCard({ currentLead }: { currentLead: Lead }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white/60 dark:bg-white/10 dark:border-gray-700">
      <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold leading-tight text-slate-800 dark:text-gray-100">
            {currentLead.lead_id}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${contactTypeBadge(
                currentLead.contact_type,
              )}`}
            >
              {currentLead.contact_type}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:ring-sky-800">
              <Clock3 className="h-3.5 w-3.5" />
              {currentLead.timezone}
            </span>
          </div>
        </div>

        <div className="flex gap-4 text-center">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-gray-600 dark:bg-gray-700/50">
            <p className="mb-0.5 flex items-center justify-center gap-1 text-xs font-medium text-slate-400 dark:text-gray-500">
              <Building2 className="h-3.5 w-3.5" />
              Company
            </p>
            <p className="text-sm font-semibold text-slate-700 dark:text-gray-200">
              {currentLead.company_name}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-gray-600 dark:bg-gray-700/50">
            <p className="mb-0.5 flex items-center justify-center gap-1 text-xs font-medium text-slate-400 dark:text-gray-500">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              Role
            </p>
            <p className="text-sm font-semibold text-slate-700 dark:text-gray-200">
              {currentLead.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
