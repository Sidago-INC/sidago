import { type UserRole } from "./navigation";

export const AUTH_NOTICE_KEY = "sidago_auth_notice";

export function getDashboardRouteForRole(role: UserRole): string {
  switch (role) {
    case "agent":
      return "/agent/dashboard";
    case "backoffice":
      return "/manager/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/";
  }
}

export function hasRouteAccess(role: UserRole, pathname: string): boolean {
  if (pathname === "/dashboard") {
    return true;
  }

  if (role === "admin") {
    return (
      pathname.startsWith("/admin/") ||
      pathname.startsWith("/agent/") ||
      pathname.startsWith("/backoffice/")
    );
  }

  if (role === "agent") {
    return (
      pathname.startsWith("/agent/") ||
      pathname === "/agent/dashboard"
    );
  }

  if (role === "backoffice") {
    return (
      pathname.startsWith("/backoffice/") ||
      pathname === "/manager/dashboard"
    );
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
