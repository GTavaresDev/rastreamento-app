import type { StatusFilter } from "../_types/trackingResults.types";

export function normalizeSearchValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function matchesStatusFilter(
  status: string,
  filter: StatusFilter
): boolean {
  if (filter === "all") {
    return true;
  }

  if (filter === "pedido") {
    return status === "pendente";
  }

  if (filter === "a_caminho") {
    return status === "em_transito" || status === "em_transferencia";
  }

  return status === filter;
}

export function getDetailUrl(id: string): string {
  return `/rastreamento/detalhes/${id}`;
}
