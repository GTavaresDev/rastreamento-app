"use client";

import { useEffect, useState } from "react";
import type { PackageDetail as PackageDetailType } from "@/types";
import { getTrackingDetailClient } from "@/services/trackingClient.gateway";
import { getStoredCpf } from "@core/infra/store/userStore";

export function useTrackingDetail(trackingId: string, cpf?: string) {
  const [item, setItem] = useState<PackageDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!trackingId) {
      setItem(null);
      setLoading(false);
      setError("Encomenda não especificada.");
      return;
    }

    let active = true;

    async function loadDetail() {
      setLoading(true);
      setError("");

      try {
        const effectiveCpf = cpf || getStoredCpf() || undefined;
        const data = await getTrackingDetailClient(trackingId, effectiveCpf);
        if (active) {
          setItem(data);
        }
      } catch (err) {
        if (active) {
          setItem(null);
          setError(
            err instanceof Error
              ? err.message
              : "Falha de rede ao carregar os detalhes. Tente novamente."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadDetail();

    return () => {
      active = false;
    };
  }, [trackingId, cpf]);

  return { item, loading, error };
}
