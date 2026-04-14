"use client";

import { useAuth } from "@/providers/AuthProvider";
import { getDashboardRouteForRole } from "@/lib/auth-routing";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleDashboardRedirect() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(getDashboardRouteForRole(user.role));
    }
  }, [isLoading, router, user]);

  return null;
}
