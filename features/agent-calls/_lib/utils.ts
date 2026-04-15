export function contactTypeBadge(type: string): string {
  const map: Record<string, string> = {
    Prospecting:
      "bg-amber-100 text-amber-700 ring-1 ring-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800",
    Interested:
      "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800",
    "Not Interested":
      "bg-slate-100 text-slate-600 ring-1 ring-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    "No Answer":
      "bg-slate-100 text-slate-600 ring-1 ring-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    "Left Message":
      "bg-blue-100 text-blue-700 ring-1 ring-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-800",
    "Call Lead Back":
      "bg-purple-100 text-purple-700 ring-1 ring-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:ring-purple-800",
    "Bad Number":
      "bg-orange-100 text-orange-700 ring-1 ring-orange-300 dark:bg-orange-950/40 dark:text-orange-300 dark:ring-orange-800",
    DNC: "bg-red-100 text-red-700 ring-1 ring-red-300 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-800",
  };

  return (
    map[type] ??
    "bg-slate-100 text-slate-600 ring-1 ring-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
  );
}

export function getAgentKeyFromCookie() {
  if (typeof document === "undefined") {
    return "mariz";
  }

  const match = document.cookie.match(/agent_name=([^;]+)/);
  const agentName = match ? decodeURIComponent(match[1]) : "Mariz";
  return agentName.split(" ")[0].toLowerCase();
}
