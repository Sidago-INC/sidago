"use client";

import { motion } from "framer-motion";
import {
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { Button } from "@/components/ui";
import { NavigationItem } from "@/lib/navigation";
import { useAuth } from "@/providers/AuthProvider";
import clsx from "clsx";

export type Props = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  navigations: NavigationItem[];
};

export const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  navigations,
}: Props) => {
  const { user } = useAuth();
  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Unknown";

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? 80 : 280,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      }}
      className="fixed inset-y-0 left-0 z-50 hidden flex-col border-r border-slate-200/80 bg-white/90 shadow-xl shadow-indigo-100/50 backdrop-blur-md transition-colors dark:border-slate-600 dark:bg-slate-950/85 dark:shadow-black/25 md:flex"
    >
      <div className="relative flex items-center justify-between overflow-hidden p-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-indigo-600 p-1.5 rounded text-white shrink-0">
            <ShieldCheck size={18} />
          </div>

          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="whitespace-nowrap text-xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-300"
            >
              Sidago CRM
            </motion.span>
          )}
        </div>
        <Button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
      absolute right-3 top-1/2 -translate-y-1/2
      flex h-8 w-8 items-center justify-center
      cursor-pointer rounded transition hover:bg-slate-100 dark:hover:bg-slate-800
      ${isCollapsed ? "z-50 border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900" : "z-10 text-slate-600 dark:text-slate-300"}
    `}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </Button>
      </div>

      <nav className="mb-10 mt-4 flex-1 overflow-y-auto overflow-x-hidden px-3">
        {navigations.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            isCollapsed={isCollapsed}
            isActive={false}
          />
        ))}
      </nav>

      <div className="border-t border-slate-200/80 p-3 dark:border-slate-600">
        <div
          className={`flex rounded-2xl border border-indigo-100 bg-indigo-50/80 text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300 ${
            isCollapsed
              ? "flex-col items-center justify-center gap-2 px-2 py-3 text-center"
              : "items-center gap-3 px-3 py-2.5"
          }`}
          title={`Role: ${roleLabel}`}
        >
          <div
            className={clsx(
              "flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white",
              isCollapsed ? "h-6 w-6" : "h-9 w-9",
            )}
          >
            <UserCog size={18} />
          </div>

          <div className={`min-w-0 ${isCollapsed ? "w-full" : ""}`}>
            {!isCollapsed && (
              <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                User Role
              </p>
            )}
            <p
              className={`font-bold overflow-hidden text-ellipsis whitespace-nowrap ${
                isCollapsed
                  ? "w-10 text-[11px] leading-tight"
                  : "truncate text-sm"
              }`}
            >
              {roleLabel}
            </p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
