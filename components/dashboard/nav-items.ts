import type { ComponentType, SVGProps } from "react";
import { HomeIcon, StoreIcon, TagIcon } from "@/components/dashboard/icons";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/dashboard/services", label: "Services", icon: TagIcon },
  { href: "/dashboard/settings", label: "Business Settings", icon: StoreIcon },
];
