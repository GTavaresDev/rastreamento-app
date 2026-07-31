"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutGrid, MapPin, User, LogOut } from "lucide-react";

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
import { getStoredUserName, getStoredCpf } from "@core/infra/store/userStore";
import { maskCpf } from "@core/domain/common/utils/formatters/cpf.formatter";

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
    icon: LayoutGrid,
  },
  {
    title: "Rastreamento",
    url: "/rastreamento",
    icon: MapPin,
    matchPrefix: "/rastreamento",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>("");
  const [userCpf, setUserCpf] = useState<string>("");

  useEffect(() => {
    const storedName = getStoredUserName();
    const storedCpf = getStoredCpf();
    if (storedName) setUserName(storedName);
    if (storedCpf) setUserCpf(maskCpf(storedCpf));
  }, [pathname]);

  function isItemActive(item: NavItem) {
    if (item.matchPrefix) {
      return pathname.startsWith(item.matchPrefix);
    }
    return pathname === item.url;
  }

  return (
    <Sidebar>
      {/* Header with top spacing and larger logo */}
      <SidebarHeader className="px-4 pt-7 pb-2">
        <Link href="/" className="flex w-full items-center justify-center gap-3">
          <Image
            src="/images/sacflow-icon.svg"
            alt={APP_NAME}
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-xl object-contain"
            unoptimized
          />
          <div className="flex flex-col min-w-0">
            <span className="truncate text-base font-bold tracking-tight text-sidebar-foreground">
              {APP_NAME}
            </span>
            <span className="truncate text-xs font-medium text-sidebar-foreground/60">
              Painel Logístico
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Main menu content */}
      <SidebarContent className="px-2.5 pt-3 pb-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {items.map((item) => {
                const active = isItemActive(item);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={active}
                      size="sm"
                      tooltip={item.title}
                      className={
                        active
                          ? "h-9 rounded-xl bg-slate-300 text-slate-950 font-bold hover:bg-slate-300 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-400"
                          : "h-9 rounded-xl text-slate-700 font-medium hover:bg-slate-200/70 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-400"
                      }
                      render={<Link href={item.url} />}
                    >
                      <Icon
                        className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                          active ? "text-slate-950" : "text-slate-600"
                        }`}
                      />
                      <span className="text-sm font-medium tracking-tight">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-200/60 p-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xs">
              {userName ? userName.charAt(0).toUpperCase() : <User className="h-3.5 w-3.5" />}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs font-semibold text-slate-900">
                {userName || "Usuário"}
              </span>
              <span className="truncate text-[11px] text-slate-500">
                {userCpf || "CPF não informado"}
              </span>
            </div>
          </div>
          <Link
            href="/login"
            title="Alterar usuário / Sair"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-300 hover:text-slate-900 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
