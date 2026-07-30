"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const cpf = searchParams.get("cpf") ?? "";
  const activeRouteTitle = getActiveRouteTitle(pathname);

  // 1. If on package details page
  if (pathname.startsWith("/rastreamento/detalhes")) {
    const backHref = cpf
      ? `/rastreamento?cpf=${encodeURIComponent(cpf)}`
      : "/rastreamento";

    return (
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-200 hover:text-slate-900"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar para a lista
      </Link>
    );
  }

  // 2. If on package list page (with CPF query param)
  if (pathname === "/rastreamento" && cpf) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-200 hover:text-slate-900"
      >
        <ChevronLeft className="h-4 w-4" />
        Alterar CPF
      </Link>
    );
  }

  // 3. Main logo fallback
  return (
    <Link href="/" className="text-sm font-bold text-slate-900">
      {activeRouteTitle}
    </Link>
  );
}

export function HeaderBackButton() {
  return (
    <Suspense
      fallback={
        <Link href="/" className="text-sm font-bold text-slate-900">
          {APP_NAME}
        </Link>
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
