"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PackageSearch, Truck } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { APP_NAME } from "@/utils/constants";

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPrefix?: string;
};

const items: NavItem[] = [
  {
    title: "Início",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Rastreamento",
    url: "/rastreamento",
    icon: PackageSearch,
    matchPrefix: "/rastreamento",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  function isItemActive(item: NavItem) {
    if (item.matchPrefix) {
      return pathname.startsWith(item.matchPrefix);
    }
    return pathname === item.url;
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4 sm:p-5">
        <Link href="/" className="flex w-full items-center justify-center gap-3">
          <Image
            src="/images/hyerlogo.jpg"
            alt={APP_NAME}
            width={56}
            height={56}
            className="h-14 w-14 rounded-2xl object-cover"
          />
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-sidebar-foreground">
              {APP_NAME}
            </span>
            <span className="text-xs font-medium text-sidebar-foreground/60">
              Painel Logístico
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {items.map((item) => {
                const active = isItemActive(item);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.title}
                      className={
                        active
                          ? "bg-slate-200 text-slate-900 font-bold hover:bg-slate-200 hover:text-slate-900"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }
                      render={<Link href={item.url} />}
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 transition-colors ${
                          active ? "text-slate-900" : "text-slate-700"
                        }`}
                      />
                      <span className="text-base font-semibold">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-100/70 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-semibold text-slate-900">
              SSW Gateway
            </span>
            <span className="truncate text-xs text-slate-500">
              Status: Operacional
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
