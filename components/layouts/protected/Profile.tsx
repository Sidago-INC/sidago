"use client";

import { Button } from "@/components/ui";
import { useLogout } from "@/hooks/useAuthActions";
import { useAuth } from "@/providers/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogOut, User } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function Profile() {
  const { user } = useAuth();
  const { mutate: logoutAction, isPending } = useLogout();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  return (
    <div className="relative">
      <Button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-transparent p-1 pr-3 transition-all hover:border-slate-200 hover:bg-slate-100/70 dark:hover:border-slate-700 dark:hover:bg-slate-800/80"
      >
        <User size={18} className="text-slate-600 dark:text-slate-200" />
        <span className="hidden text-sm font-bold text-slate-700 dark:text-slate-100 sm:inline">
          {user?.name?.split(" ")[0]}
        </span>
        <ChevronDown size={12} className="text-slate-400 dark:text-slate-500" />
      </Button>
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsProfileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-slate-200/80 bg-white p-2 shadow-2xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30"
            >
              <div className="py-1">
                <Link
                  href="/profile"
                  className="flex w-full items-center gap-3 rounded px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-indigo-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <User size={16} /> Profile
                </Link>
                <Button
                  disabled={isPending}
                  onClick={() => logoutAction()}
                  className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <LogOut size={16} /> Logout
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
