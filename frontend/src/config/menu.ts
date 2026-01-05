import { LayoutDashboard, UserCheck, Users, Settings } from "lucide-react";

export const sidebarMenu = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: UserCheck,
  },
  {
    title: "Employees",
    href: "/employees",
    icon: Users,
    // TODO: later will add logic role in here
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
