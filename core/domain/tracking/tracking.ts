import { scrapeTrackingByCpf } from "@/services/ssw/tracking/getTracking.gateway";
import { parseTrackingListHtml } from "@/services/ssw/tracking/tracking.parser";
import { validateCpf } from "@core/domain/common/utils/validators/cpf.validator";
import { logError } from "@core/domain/common/utils/error/logger";
import type { PackageSummary, TrackingListItem } from "@/types";

type ListCacheEntry = { data: TrackingListItem[]; expiresAt: number };
const listCache = new Map<string, ListCacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function fetchTrackingListByCpf(cpf: string): Promise<TrackingListItem[]> {
  const validation = validateCpf(cpf);

  if (!validation.valid) {
    logError("INVALID_CPF", "CPF inválido.");
  }

  const cached = listCache.get(validation.cleaned);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const listHtml = await scrapeTrackingByCpf(validation.cleaned);
  const parsed = parseTrackingListHtml(listHtml);

  listCache.set(validation.cleaned, { data: parsed, expiresAt: Date.now() + CACHE_TTL_MS });
  return parsed;
}

export async function getTrackingByCpf(cpf: string): Promise<PackageSummary[]> {
  const listItems = await fetchTrackingListByCpf(cpf);

  return listItems.map((item) => ({
    id: item.id,
    recipient: item.recipient,
    nfNumber: item.nfNumber,
    orderNumber: item.orderNumber,
    currentStatus: item.currentStatus,
    lastEvent: item.lastEvent,
    eventCount: 1,
  }));
}
