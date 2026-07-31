"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import { APP_NAME } from "@/utils/constants";

function getActiveRouteTitle(pathname: string) {
  if (pathname === "/dashboard") {
    return "Início";
  }

  if (pathname.startsWith("/rastreamento")) {
    return "Rastreamento";
  }

  return APP_NAME;
}

function HeaderBackButtonContent() {
  const pathname = usePathname();
  const activeRouteTitle = getActiveRouteTitle(pathname);

  // 1. If on package details page
  if (pathname.startsWith("/rastreamento/detalhes")) {
    return (
      <Link
        href="/rastreamento"
        className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar para a lista
      </Link>
    );
  }

  // 2. Active screen title (black text, balanced font size)
  return (
    <span className="text-sm font-bold text-slate-900 sm:text-base">
      {activeRouteTitle}
    </span>
  );
}

export function HeaderBackButton() {
  return (
    <Suspense
      fallback={
        <span className="text-sm font-bold text-slate-900 sm:text-base">
          {APP_NAME}
        </span>
      }
    >
      <HeaderBackButtonContent />
    </Suspense>
  );
}

export function HeaderPageTitle() {
  const pathname = usePathname();

  if (!pathname.startsWith("/rastreamento/detalhes")) {
    return null;
  }

  return (
    <h1 className="truncate text-sm font-bold text-slate-900 sm:text-base">
      Detalhes da encomenda
    </h1>
  );
}
