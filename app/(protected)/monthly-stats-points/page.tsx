import React from "react";

export const metadata = {
  title: "Monthly Stats & Points | Sidago CRM",
  description:
    "Sidago CRM is a secure and scalable customer relationship management platform designed to help businesses manage leads, track interactions, and build stronger customer connections with ease.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return (
    <main className="min-h-full p-6 md:p-8">
      <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-black/20">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
          Monthly Stats & Points
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          This section is ready for the upcoming monthly statistics and points
          dashboard.
        </p>
      </section>
    </main>
  );
}
