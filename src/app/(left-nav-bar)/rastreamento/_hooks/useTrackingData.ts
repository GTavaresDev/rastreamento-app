"use client";

import { useEffect, useState } from "react";
import type { PackageSummary } from "@/types";
import { getTrackingByCpfClient } from "@/services/trackingClient.gateway";

export function useTrackingData() {
  const [packages, setPackages] = useState<PackageSummary[]>([]);
  const [scrapedAt, setScrapedAt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let active = true;

    async function fetchPackages() {
      setLoading(true);
      setError("");

      try {
        const data = await getTrackingByCpfClient();
        if (active) {
          setPackages(data);
          setScrapedAt(new Date().toISOString());
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Falha de rede ao carregar as encomendas."
          );
          setPackages([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchPackages();

    return () => {
      active = false;
    };
  }, []);

  return { packages, scrapedAt, loading, error };
}
