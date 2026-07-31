import Link from "next/link";
import { MoreVertical } from "lucide-react";
import type { PackageSummary } from "@/types";
import { formatRelativeDate } from "@core/domain/common/utils/formatters/date.formatter";
import { StatusBadge } from "@/app/(left-nav-bar)/rastreamento/_components/StatusBadge";

type PackageCardProps = {
  item: PackageSummary;
  scrapedAt?: string;
};

export function PackageCard({ item, scrapedAt }: PackageCardProps) {
  const detailUrl = `/rastreamento/detalhes/${item.id}`;

  return (
    <Link
      href={detailUrl}
      className="group block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 sm:p-5"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Nota fiscal
          </p>
          <p className="font-mono text-sm font-medium text-slate-700 sm:text-[15px]">
            {item.nfNumber}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={item.currentStatus} />
          <div className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors group-hover:bg-slate-100 group-hover:text-slate-900">
            <MoreVertical className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Destinatário
        </p>
        <p className="mt-1.5 text-base font-semibold leading-6 text-slate-900">
          {item.recipient}
        </p>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50/80 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Última atualização
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-slate-600 transition-colors group-hover:text-slate-700">
            {item.lastEvent.description}
          </p>
          <span className="shrink-0 text-xs font-medium text-slate-400 sm:text-sm">
            {formatRelativeDate(item.lastEvent.dateTime, scrapedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
