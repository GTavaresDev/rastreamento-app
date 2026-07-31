"use client";

import type { StatusFilter } from "../_types/trackingResults.types";

type TrackingFilterBarProps = {
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  statusFilters: Array<{ value: StatusFilter; label: string }>;
  totalItems: number;
};

export function TrackingFilterBar({
  statusFilter,
  setStatusFilter,
  statusFilters,
  totalItems,
}: TrackingFilterBarProps) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-4 px-4 py-2.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
          <span className="hidden shrink-0 text-xs font-semibold text-slate-500 sm:inline">
            Situação
          </span>
          {statusFilters.map((filter) => {
            const active = statusFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={active}
                onClick={() => setStatusFilter(filter.value)}
                className={`shrink-0 cursor-pointer rounded-xl border px-3.5 py-1.5 text-xs transition-all ${
                  active
                    ? "border-neutral-400 bg-neutral-300 text-neutral-950 font-bold shadow-xs"
                    : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 font-medium"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
        <p className="shrink-0 text-sm font-semibold text-slate-700">
          {totalItems} {totalItems === 1 ? "encomenda" : "encomendas"}
        </p>
      </div>
    </div>
  );
}
