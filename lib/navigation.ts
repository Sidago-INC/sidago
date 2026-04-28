import {
  BarChart2,
  Building2,
  Clock,
  Flame,
  History,
  LayoutDashboard,
  List,
  Lock,
  Mail,
  MailWarning,
  MailX,
  MessageSquare,
  Package,
  Phone,
  RefreshCw,
  RotateCcw,
  Target,
  Upload,
  UserPlus,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type UserRole = "agent" | "admin" | "backoffice";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const agentNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Calls",
    href: "/calls",
    icon: Phone,
  },
];

export const backofficeNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Currently Hot Leads - SVG",
    href: "/currently-hot-leads-svg",
    icon: Flame,
  },
  {
    label: "Currently Hot Leads - 95RM",
    href: "/currently-hot-leads-95rm",
    icon: Flame,
  },
  {
    label: "Currently Hot Leads - Benton",
    href: "/currently-hot-leads-benton",
    icon: Flame,
  },
  {
    label: "Recent Interest - SVG",
    href: "/recent-interest-svg",
    icon: Clock,
  },
  {
    label: "Recent Interest - 95RM",
    href: "/recent-interest-95rm",
    icon: Clock,
  },
  {
    label: "Recent Interest - Benton",
    href: "/recent-interest-benton",
    icon: Clock,
  },
  {
    label: "Unassigned Hot Leads - SVG",
    href: "/unassigned-hot-leads-svg",
    icon: Package,
  },
  {
    label: "Unassigned Hot Leads - 95RM",
    href: "/unassigned-hot-leads-95rm",
    icon: Package,
  },
  {
    label: "Unassigned Hot Leads - Benton",
    href: "/unassigned-hot-leads-benton",
    icon: Package,
  },
  {
    label: "Ever Been Hot - SVG",
    href: "/ever-been-hot-svg",
    icon: RotateCcw,
  },
  {
    label: "Ever Been Hot - 95RM",
    href: "/ever-been-hot-95rm",
    icon: RotateCcw,
  },
  {
    label: "Ever Been Hot - Benton",
    href: "/ever-been-hot-benton",
    icon: RotateCcw,
  },
  {
    label: "Closed Contacts",
    href: "/closed-contacts",
    icon: Lock,
  },
];

export const adminOnlyNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Level 2 Update",
    href: "/level-2-update",
    icon: RefreshCw,
  },
  {
    label: "Level 2 History",
    href: "/level-2-history",
    icon: History,
  },
  {
    label: "Fix Leads",
    href: "/fix-leads",
    icon: Wrench,
  },
  {
    label: "Leads Stats",
    href: "/leads-stats",
    icon: BarChart2,
  },
  {
    label: "SMS - Mariz Cabido",
    href: "/sms/mariz-cabido",
    icon: MessageSquare,
  },
  {
    label: "SMS - Tom Silver",
    href: "/sms/tom-silver",
    icon: MessageSquare,
  },
  {
    label: "SMS - Bryan Taylor",
    href: "/sms/bryan-taylor",
    icon: MessageSquare,
  },
  {
    label: "SMS - Chris Moore",
    href: "/sms/chris-moore",
    icon: MessageSquare,
  },
  {
    label: "Email - Mariz Cabido",
    href: "/email/mariz-cabido",
    icon: Mail,
  },
  {
    label: "Email - Tom Silver",
    href: "/email/tom-silver",
    icon: Mail,
  },
  {
    label: "Email - Bryan Taylor",
    href: "/email/bryan-taylor",
    icon: Mail,
  },
  {
    label: "Email - Chris Moore",
    href: "/email/chris-moore",
    icon: Mail,
  },  
  {
    label: "Blocked Email",
    href: "/blocked-email",
    icon: MailX,
  },
  {
    label: "Add Company",
    href: "/companies/add",
    icon: Building2,
  },
  {
    label: "Bulk Company Import",
    href: "/companies/bulk-import",
    icon: Upload,
  },
  {
    label: "Update Company",
    href: "/companies/update",
    icon: Building2,
  },
  {
    label: "Add Lead",
    href: "/leads/add",
    icon: UserPlus,
  },
  {
    label: "Bulk Lead Import",
    href: "/leads/bulk-import",
    icon: Upload,
  },
  {
    label: "All Leads",
    href: "/leads",
    icon: Target,
  },
  {
    label: "Additional Contacts",
    href: "/additional-contacts",
    icon: UserPlus,
  },
  {
    label: "Email Blocklist Directory",
    href: "/email-blocklist-directory",
    icon: List,
  },
  {
    label: "Dead/Missing Email",
    href: "/dead-missing-email",
    icon: MailWarning,
  },
];

const navigationByRole: Record<UserRole, NavigationItem[]> = {
  agent: agentNavigation,
  admin: [
    ...adminOnlyNavigation,
    ...agentNavigation.filter((item) => item.href !== "/dashboard"),
    ...backofficeNavigation.filter((item) => item.href !== "/dashboard"),
  ],
  backoffice: backofficeNavigation,
};

export const getNavigationsForRole = (role?: string): NavigationItem[] => {
  if (!role) {
    return [];
  }

  return navigationByRole[role as UserRole] ?? [];
};
