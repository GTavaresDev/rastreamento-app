import type {
  PackageSummary,
  PackageDetail,
  TrackingDetailResponse,
  TrackingError,
} from "@/types";

export async function getTrackingByCpfClient(
  cpf: string
): Promise<PackageSummary[]> {
  const response = await fetch(`/api/tracking?cpf=${encodeURIComponent(cpf)}`);

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(
      errorBody?.error || "Não foi possível carregar as encomendas."
    );
  }

  return response.json();
}

export async function getTrackingDetailClient(
  trackingId: string,
  cpf?: string
): Promise<PackageDetail> {
  const queryParams = new URLSearchParams({ trackingId });
  if (cpf) {
    queryParams.set("cpf", cpf);
  }

  const response = await fetch(`/api/tracking/detail?${queryParams}`);
  const payload = (await response.json()) as
    | TrackingDetailResponse
    | TrackingError;

  if (!payload.success || !response.ok) {
    throw new Error(
      !payload.success && payload.error
        ? payload.error
        : "Não foi possível carregar os detalhes da encomenda."
    );
  }

  return payload.data;
}
