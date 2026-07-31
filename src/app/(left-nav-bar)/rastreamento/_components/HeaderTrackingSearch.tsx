"use client";

import { Suspense } from "react";
import { Search } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useTrackingSearch } from "../_context/TrackingSearchContext";

function HeaderTrackingSearchContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { query, setQuery } = useTrackingSearch();

  if (pathname !== "/rastreamento" || !searchParams.get("cpf")) {
    return null;
  }

  return (
    <div className="relative w-[clamp(10rem,32vw,28rem)]">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      />
      <Input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar encomendas"
        aria-label="Buscar por nota fiscal, pedido ou destinatário"
        className="h-9 rounded-xl border-slate-200 bg-slate-50 pl-9 text-sm shadow-none placeholder:text-slate-400"
      />
    </div>
  );
}

export function HeaderTrackingSearch() {
  return (
    <Suspense fallback={null}>
      <HeaderTrackingSearchContent />
    </Suspense>
  );
}
