"use client";

import { useEffect, useMemo, useState } from "react";
import type { PackageSummary } from "@/types";
import { getTrackingByCpfClient } from "@/services/trackingClient.gateway";
import { parseSswDateTime } from "@core/domain/common/utils/formatters/date.formatter";
import mockData from "../_mocks/data.json";

export function useDashboardData(useMockData: boolean) {
  const [packages, setPackages] = useState<PackageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      if (useMockData) {
        timer = setTimeout(() => {
          if (active) {
            setPackages(mockData as PackageSummary[]);
            setLoading(false);
          }
        }, 200);
        return;
      }

      try {
        const data = await getTrackingByCpfClient();

        if (active) {
          setPackages(data);
        }
      } catch (loadError) {
        if (active) {
          setPackages([]);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Falha de rede ao carregar seus rastreamentos.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [reloadKey, useMockData]);

  const stats = useMemo(() => {
    let pedidoCount = 0;
    let aCaminhoCount = 0;
    let entregueCount = 0;
    let devolvidoCount = 0;

    for (const item of packages) {
      if (item.currentStatus === "pendente") {
        pedidoCount++;
      } else if (
        item.currentStatus === "em_transito" ||
        item.currentStatus === "em_transferencia"
      ) {
        aCaminhoCount++;
      } else if (item.currentStatus === "entregue") {
        entregueCount++;
      } else if (item.currentStatus === "devolvido") {
        devolvidoCount++;
      }
    }

    const total = packages.length;
    const calcPercentage = (count: number) =>
      total > 0 ? Math.round((count / total) * 100) : 0;

    return {
      total,
      pedidoCount,
      aCaminhoCount,
      entregueCount,
      devolvidoCount,
      pedidoPct: calcPercentage(pedidoCount),
      aCaminhoPct: calcPercentage(aCaminhoCount),
      entreguePct: calcPercentage(entregueCount),
      devolvidoPct: calcPercentage(devolvidoCount),
    };
  }, [packages]);

  const recentPackages = useMemo(
    () =>
      [...packages]
        .sort((left, right) => {
          const leftDate = parseSswDateTime(left.lastEvent.dateTime)?.getTime() ?? 0;
          const rightDate = parseSswDateTime(right.lastEvent.dateTime)?.getTime() ?? 0;
          return rightDate - leftDate;
        })
        .slice(0, 5),
    [packages],
  );

  return {
    packages,
    recentPackages,
    stats,
    loading,
    error,
    reload: () => setReloadKey((current) => current + 1),
  };
}
