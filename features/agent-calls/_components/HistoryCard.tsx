import { LucideIcon } from "lucide-react";

export function HistoryCard({
  title,
  value,
  icon: Icon,
  className = "",
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-gray-500">
        <Icon className="h-4 w-4" />
        {title}
      </p>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-gray-300">
        {value || "-"}
      </p>
    </div>
  );
}
