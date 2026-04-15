"use client";
import React, { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Mobilebar from "./Mobilebar";
import { useAuth } from "@/providers/AuthProvider";
import { PrivateRoute } from "@/components/guards/PrivateRoute";

export function AuthLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { navigations } = useAuth();

  return (
    <PrivateRoute>
      <div className="flex h-screen overflow-hidden bg-transparent">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          navigations={navigations}
        />

        <div
          className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ease-in-out ${
            isCollapsed
              ? "md:ml-20 md:w-[calc(100%-5rem)]"
              : "md:md:ml-70 md:w-[calc(100%-280px)]"
          }`}
        >
          <Header onMenuClick={() => setIsMobileOpen(true)} />

          <main className="overflow-y-auto text-slate-900 transition-colors dark:text-slate-100">
            {children}
          </main>
        </div>
        <Mobilebar
          navigations={navigations}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
      </div>
    </PrivateRoute>
  );
}
