import { scrapeTrackingByCpf, scrapeTrackingDetail } from "@/services/ssw/tracking/getTracking.gateway";
import { parseTrackingDetailHtml, parseTrackingListHtml } from "@/services/ssw/tracking/tracking.parser";
import { validateCpf } from "@core/domain/common/utils/validators/cpf.validator";
import { logError } from "@core/domain/common/utils/error/logger";
import type { TrackingDetailResponse, TrackingListItem } from "@/types";

async function fetchTrackingListByCpf(cpf: string): Promise<TrackingListItem[]> {
  const validation = validateCpf(cpf);

  if (!validation.valid) {
    logError("INVALID_CPF", "CPF inválido.");
  }

  const listHtml = await scrapeTrackingByCpf(validation.cleaned);
  return parseTrackingListHtml(listHtml);
}

export async function getTrackingDetailById(
  cpf: string,
  trackingId: string,
): Promise<TrackingDetailResponse> {
  const normalizedId = trackingId.trim();
  const listItems = await fetchTrackingListByCpf(cpf);
  const targetItem = listItems.find((item) => item.id === normalizedId);

  if (!targetItem) {
    logError("TRACKING_NOT_FOUND", "Encomenda não encontrada para este CPF.");
  }

  const detailHtml = await scrapeTrackingDetail(targetItem.detailPath);
  const detail = parseTrackingDetailHtml(detailHtml, targetItem);

  return {
    success: true,
    data: detail,
    scrapedAt: new Date().toISOString(),
  };
}
