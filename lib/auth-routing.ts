import { type UserRole } from "./navigation";

export const AUTH_NOTICE_KEY = "sidago_auth_notice";

const agentRoutes = new Set(["/dashboard", "/calls"]);

const backofficeRoutes = new Set([
  "/dashboard",
  "/currently-hot-leads-svg",
  "/currently-hot-leads-95rm",
  "/currently-hot-leads-benton",
  "/recent-interest-svg",
  "/recent-interest-95rm",
  "/recent-interest-benton",
  "/unassigned-hot-leads-svg",
  "/unassigned-hot-leads-95rm",
  "/unassigned-hot-leads-benton",
  "/ever-been-hot-svg",
  "/ever-been-hot-95rm",
  "/ever-been-hot-benton",
  "/monthly-stats-points",
  "/closed-contacts",
]);

const allProtectedRoutes = new Set([...agentRoutes, ...backofficeRoutes]);

export function getDashboardRouteForRole(role: UserRole): string {
  switch (role) {
    case "agent":
    case "backoffice":
    case "admin":
      return "/dashboard";
    default:
      return "/";
  }
}

export function hasRouteAccess(role: UserRole, pathname: string): boolean {
  if (role === "admin") {
    return allProtectedRoutes.has(pathname);
  }

  if (role === "agent") {
    return agentRoutes.has(pathname);
  }

  if (role === "backoffice") {
    return backofficeRoutes.has(pathname);
  }

  return false;
}

export function setAuthNotice(message: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(AUTH_NOTICE_KEY, message);
}

export function consumeAuthNotice(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const message = window.sessionStorage.getItem(AUTH_NOTICE_KEY);

  if (message) {
    window.sessionStorage.removeItem(AUTH_NOTICE_KEY);
  }

  return message;
}
