"use client";

import { useEffect, useState } from "react";
import type { PackageDetail as PackageDetailType } from "@/types";
import { getTrackingDetailClient } from "@/services/trackingClient.gateway";

export function useTrackingDetail(trackingId: string) {
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
        const data = await getTrackingDetailClient(trackingId);
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
  }, [trackingId]);

  return { item, loading, error };
}
