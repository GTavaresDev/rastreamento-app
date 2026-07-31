"use client";

import { useEffect, useMemo, useState } from "react";
import type { PackageSummary } from "@/types";
import { useRequireCpfAuth } from "@/app/login/_hooks/useRequireCpfAuth";
import mockData from "../_mocks/data.json";

export function useDashboardData() {
  const { activeCpf, userName, isChecking: isAuthChecking } = useRequireCpfAuth();
  const [packages, setPackages] = useState<PackageSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    const timer = setTimeout(() => {
      if (active) {
        setPackages(mockData as PackageSummary[]);
        setLoading(false);
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

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

  const recentPackages = useMemo(() => {
    return packages.slice(0, 5);
  }, [packages]);

  return {
    activeCpf,
    userName,
    packages,
    recentPackages,
    stats,
    loading: isAuthChecking || loading,
  };
}
