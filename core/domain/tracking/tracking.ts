import { scrapeTrackingByCpf } from "@/services/ssw/tracking/getTracking.gateway";
import { parseTrackingListHtml } from "@/services/ssw/tracking/tracking.parser";
import { validateCpf } from "@core/domain/common/utils/validators/cpf.validator";
import { logError } from "@core/domain/common/utils/error/logger";
import type { PackageSummary, TrackingListItem } from "@/types";

async function fetchTrackingListByCpf(cpf: string): Promise<TrackingListItem[]> {
  const validation = validateCpf(cpf);

  if (!validation.valid) {
    logError("INVALID_CPF", "CPF inválido.");
  }

  const listHtml = await scrapeTrackingByCpf(validation.cleaned);
  return parseTrackingListHtml(listHtml);
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

