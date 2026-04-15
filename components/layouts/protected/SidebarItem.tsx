"use client";

import { NavigationItem } from "@/lib/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export type Props = {
  item: NavigationItem;
  isCollapsed: boolean;
  isActive: boolean;
};

export const SidebarItem = ({ item, isCollapsed, isActive }: Props) => {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={item.label}
      className={`group flex cursor-pointer items-center rounded-xl border p-2 transition-all duration-300 md:w-full ${
        isCollapsed ? "justify-center" : "justify-start"
      } ${
        isActive
          ? "border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:border-indigo-400 dark:bg-indigo-500 dark:shadow-indigo-950/40"
          : "border-transparent text-slate-500 hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          size={18}
          className={
            isActive
              ? "text-white"
              : "group-hover:text-indigo-700 dark:group-hover:text-indigo-300"
          }
        />
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-semibold text-[0.875rem] tracking-wide whitespace-nowrap overflow-hidden text-ellipsis min-w-0"
          >
            {item.label}
          </motion.span>
        )}
      </div>
    </Link>
  );
};
