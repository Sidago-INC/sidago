import { CalendarDays, Clock4, Wrench } from "lucide-react";

type DatesCardProps = {
  callBackDate: string;
  lastCalledDate: string;
  lastFixedDate: string;
  onChangeCallBackDate: (value: string) => void;
};

export function DatesCard({
  callBackDate,
  lastCalledDate,
  lastFixedDate,
  onChangeCallBackDate,
}: DatesCardProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-gray-500">
        Dates
      </p>
      <div>
        <p className="mb-1 text-xs text-slate-400 dark:text-gray-500">
          Call Back Date
        </p>
        <div className="relative">
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-gray-500" />
          <input
            type="date"
            value={callBackDate}
            onChange={(event) => onChangeCallBackDate(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 transition focus:outline-none ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
      </div>
      <div className="border-t border-slate-100 pt-2 dark:border-gray-700">
        <p className="mb-0.5 flex items-center gap-1 text-xs text-slate-400 dark:text-gray-500">
          <Clock4 className="h-3.5 w-3.5" />
          Last Called
        </p>
        <p className="text-sm font-medium text-slate-700 dark:text-gray-300">
          {lastCalledDate || "-"}
        </p>
      </div>
      <div className="border-t border-slate-100 pt-2 dark:border-gray-700">
        <p className="mb-0.5 flex items-center gap-1 text-xs text-slate-400 dark:text-gray-500">
          <Wrench className="h-3.5 w-3.5" />
          Last Fixed Date
        </p>
        <p className="text-sm font-medium text-slate-700 dark:text-gray-300">
          {lastFixedDate || "-"}
        </p>
      </div>
    </div>
  );
}
