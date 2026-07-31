"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { PackageSummary } from "@/types";
import { useTrackingSearch } from "../_context/TrackingSearchContext";
import { getStatusLabel } from "@core/domain/common/utils/formatters/date.formatter";
import { type StatusFilter, STATUS_FILTERS } from "../_types/trackingResults.types";
import {
  normalizeSearchValue,
  matchesStatusFilter,
  getDetailUrl,
} from "../_utils/trackingResults.utils";

type UseTrackingResultsProps = {
  items: PackageSummary[];
  cpf?: string;
};

export function useTrackingResults({ items, cpf }: UseTrackingResultsProps) {
  const router = useRouter();
  const { query } = useTrackingSearch();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredItems = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(query);

    return items.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        normalizeSearchValue(
          [
            item.nfNumber,
            item.orderNumber,
            item.recipient,
            item.lastEvent.description,
            getStatusLabel(item.currentStatus),
          ].join(" ")
        ).includes(normalizedQuery);

      return (
        matchesQuery && matchesStatusFilter(item.currentStatus, statusFilter)
      );
    });
  }, [items, query, statusFilter]);

  return {
    statusFilter,
    setStatusFilter,
    statusFilters: STATUS_FILTERS,
    filteredItems,
    router,
    getDetailUrl: (id: string) => getDetailUrl(id),
  };
}
