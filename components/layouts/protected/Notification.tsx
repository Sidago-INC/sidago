"use client";
import { Button } from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import React, { useState } from "react";

export default function Notification() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        onClick={() => setIsNotifOpen(!isNotifOpen)}
        className="relative cursor-pointer rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <Bell size={18} />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full border-2 border-white bg-red-500 dark:border-slate-900" />
      </Button>
      <AnimatePresence>
        {isNotifOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsNotifOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 z-20 mt-2 w-72 rounded-2xl border border-slate-200/70 bg-white p-2 shadow-2xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30"
            >
              <p className="border-b border-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                Notifications
              </p>
              <div className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                No new alerts.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
