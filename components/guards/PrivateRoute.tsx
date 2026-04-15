"use client";

import { useAuth } from "@/providers/AuthProvider";
import { getDashboardRouteForRole, hasRouteAccess } from "@/lib/auth-routing";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const hasAccessToRoute = user ? hasRouteAccess(user.role, pathname) : false;

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
      return;
    }

    if (!isLoading && user && !hasAccessToRoute) {
      router.replace(getDashboardRouteForRole(user.role));
    }
  }, [user, isLoading, hasAccessToRoute, router]);

  if (isLoading) return null;

  if (!user) return null;

  if (!hasAccessToRoute) return null;

  return <>{children}</>;
}
