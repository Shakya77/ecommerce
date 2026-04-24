"use client";

import * as React from "react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  TerminalSquareIcon,
  Settings2Icon,
  Command,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/constants";
import { NavSubMain } from "./nav-sub-main";
import { NavMain } from "./nav-main";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      url: "/admin/dashboard/product",
      icon: LayoutDashboard,
    },
  ],
  navSubMain: [
    {
      title: "Config",
      url: "#",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        {
          title: "Category",
          url: "/admin/dashboard/category",
        },
        {
          title: "Carousel",
          url: "/admin/dashboard/carousel",
        },
        {
          title: "Promo",
          url: "/admin/dashboard/promo",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        {
          title: "Orders",
          url: "/admin/dashboard/orders",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild>
          <a href="#">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Command className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Ecommerce</span>
              <span className="truncate text-xs">{ROLES[role]} Dashboard</span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSubMain items={data.navSubMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
