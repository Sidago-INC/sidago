import { Lead } from "@/types";
import { Phone } from "lucide-react";

export function PhoneCard({ currentLead }: { currentLead: Lead }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-gray-500">
        Phone
      </p>
      <a
        href={`tel:${currentLead.phone}`}
        className="group flex items-center gap-2 text-lg font-bold text-sky-600 transition-colors hover:text-sky-500 dark:text-sky-400"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 transition-colors group-hover:bg-sky-200 dark:bg-sky-900/40 dark:group-hover:bg-sky-900/60">
          <Phone className="h-4 w-4" />
        </span>
        {currentLead.phone}
      </a>
    </div>
  );
}
