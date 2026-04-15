"use client";

import { useAuth } from "@/providers/AuthProvider";
import { getDashboardRouteForRole } from "@/lib/auth-routing";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(getDashboardRouteForRole(user.role));
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;

  if (user) return null;

  return <>{children}</>;
}
