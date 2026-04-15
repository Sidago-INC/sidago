import { HasRole } from "@/components/guards/HasRole";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";

export const metadata = {
  title: "Manager Dashboard | Sidago CRM",
  description: "Manager dashboard for Sidago CRM.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ManagerDashboardPage() {
  return (
    <HasRole name="backoffice">
      <main className="min-h-full p-6 md:p-8">
        <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-black/20">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <BriefcaseBusiness size={24} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
            Manager Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            This manager landing page gives backoffice users a dedicated
            dashboard route and quick access to their current lead workflows.
          </p>
          <div className="mt-8">
            <Link
              href="/backoffice/currently-hot-leads-svg"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Open Lead Workspace
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    </HasRole>
  );
}
