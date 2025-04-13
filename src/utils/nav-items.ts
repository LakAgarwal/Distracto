
import { 
  Home, 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  User,
  Users
} from "lucide-react";

export const mainNavItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Timetable",
    href: "/timetable",
    icon: Calendar,
  },
  {
    title: "Screen Time",
    href: "/screen-time",
    icon: Clock,
  },
  {
    title: "Website Blocking",
    href: "/website-blocking",
    icon: ShieldCheck,
  },
  {
    title: "Social",
    href: "/social",
    icon: Users,
  },
];

export const userNavItems = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];
