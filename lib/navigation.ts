import {
  BarChart,
  Clock,
  Flame,
  LayoutDashboard,
  Lock,
  Package,
  Phone,
  RotateCcw,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export type UserRole = "agent" | "admin" | "backoffice";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const agentNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/agent/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Calls",
    href: "/agent/calls",
    icon: Phone,
  },
];

const backofficeNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/manager/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Currently Hot Leads - SVG",
    href: "/backoffice/currently-hot-leads-svg",
    icon: Flame,
  },
  {
    label: "Currently Hot Leads - 95RM",
    href: "/backoffice/currently-hot-leads-95rm",
    icon: Flame,
  },
  {
    label: "Currently Hot Leads - Benton",
    href: "/backoffice/currently-hot-leads-benton",
    icon: Flame,
  },
  {
    label: "Recent Interest - SVG",
    href: "/backoffice/recent-interest-svg",
    icon: Clock,
  },
  {
    label: "Recent Interest - 95RM",
    href: "/backoffice/recent-interest-95rm",
    icon: Clock,
  },
  {
    label: "Recent Interest - Benton",
    href: "/backoffice/recent-interest-benton",
    icon: Clock,
  },
  {
    label: "Unassigned Hot Leads - SVG",
    href: "/backoffice/unassigned-hot-leads-svg",
    icon: Package,
  },
  {
    label: "Unassigned Hot Leads - 95RM",
    href: "/backoffice/unassigned-hot-leads-95rm",
    icon: Package,
  },
  {
    label: "Unassigned Hot Leads - Benton",
    href: "/backoffice/unassigned-hot-leads-benton",
    icon: Package,
  },
  {
    label: "Ever Been Hot - SVG",
    href: "/backoffice/ever-been-hot-svg",
    icon: RotateCcw,
  },
  {
    label: "Ever Been Hot - 95RM",
    href: "/backoffice/ever-been-hot-95rm",
    icon: RotateCcw,
  },
  {
    label: "Ever Been Hot - Benton",
    href: "/backoffice/ever-been-hot-benton",
    icon: RotateCcw,
  },
  {
    label: "Leaderboard",
    href: "/backoffice/leaderboard",
    icon: Trophy,
  },
  {
    label: "Monthly Stats. & Points",
    href: "/backoffice/monthly-stats-points",
    icon: BarChart,
  },
  {
    label: "Closed Contacts",
    href: "/backoffice/closed-contacts",
    icon: Lock,
  },
];

const navigationByRole: Record<UserRole, NavigationItem[]> = {
  agent: agentNavigation,
  admin: [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    ...agentNavigation.filter((item) => item.href !== "/agent/dashboard"),
    ...backofficeNavigation.filter((item) => item.href !== "/manager/dashboard"),
  ],
  backoffice: backofficeNavigation,
};

export const getNavigationsForRole = (role?: string): NavigationItem[] => {
  if (!role) {
    return [];
  }

  return navigationByRole[role as UserRole] ?? [];
};
