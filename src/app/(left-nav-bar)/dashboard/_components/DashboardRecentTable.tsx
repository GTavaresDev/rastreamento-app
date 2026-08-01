"use client";

import type { PackageSummary } from "@/types";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/app/(left-nav-bar)/rastreamento/_components/StatusBadge";
import { PackageSearch } from "lucide-react";

type DashboardRecentTableProps = {
  items: PackageSummary[];
};

export function DashboardRecentTable({
  items,
}: DashboardRecentTableProps) {
  return (
    <Card className="flex h-full flex-col justify-between border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            Rastreamentos Recentes
          </h2>
          <p className="text-xs text-slate-500">
            Últimas movimentações de encomendas cadastradas
          </p>
        </div>

        {items.length > 0 ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-3 py-2.5">Nota fiscal</th>
                  <th className="px-3 py-2.5">Pedido</th>
                  <th className="px-3 py-2.5">Destinatário</th>
                  <th className="px-3 py-2.5">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-3 py-3 font-semibold text-slate-950">
                      {item.nfNumber}
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-700">
                      {item.orderNumber}
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-900">
                      <span className="line-clamp-1 max-w-[180px]">
                        {item.recipient}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={item.currentStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <PackageSearch className="h-5 w-5" />
            </div>
            <p className="mt-2 text-xs font-semibold text-slate-900">
              Nenhuma encomenda recente encontrada.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
