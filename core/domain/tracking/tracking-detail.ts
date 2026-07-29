import { scrapeTrackingDetail } from "@/services/ssw/tracking/getTracking.gateway";
import { parseTrackingDetailHtml } from "@/services/ssw/tracking/tracking.parser";
import { fetchTrackingListByCpf } from "@core/domain/tracking/tracking";
import type { TrackingDetailResponse } from "@/types";
import { logError } from "@core/domain/common/utils/error/logger";

type DetailCacheEntry = { data: TrackingDetailResponse; expiresAt: number };
const detailCache = new Map<string, DetailCacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function getTrackingDetailById(
  cpf: string,
  trackingId: string,
): Promise<TrackingDetailResponse> {
  const normalizedId = trackingId.trim();
  const cacheKey = `${cpf.trim()}:${normalizedId}`;

  const cached = detailCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const listItems = await fetchTrackingListByCpf(cpf);
  const targetItem = listItems.find((item) => item.id === normalizedId);

  if (!targetItem) {
    logError("TRACKING_NOT_FOUND", "Encomenda não encontrada para este CPF.");
  }

  const detailHtml = await scrapeTrackingDetail(targetItem.detailPath);
  const detail = parseTrackingDetailHtml(detailHtml, targetItem);

  const response: TrackingDetailResponse = {
    success: true,
    data: detail,
    scrapedAt: new Date().toISOString(),
  };

  detailCache.set(cacheKey, { data: response, expiresAt: Date.now() + CACHE_TTL_MS });
  return response;
}
