"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PackageListLoading } from "@/app/(left-nav-bar)/rastreamento/_components/TrackingLoadingStates";
import { useDashboardData } from "../_hooks/useDashboardData";
import { DashboardKpiCards } from "./DashboardKpiCards";
import { DashboardRecentTable } from "./DashboardRecentTable";
import { DashboardStatusChart } from "./DashboardStatusChart";

export function DashboardContent({ useMockData }: { useMockData: boolean }) {
  const { recentPackages, stats, loading, error, reload } =
    useDashboardData(useMockData);

  if (loading) {
    return <PackageListLoading />;
  }

  if (error) {
    return (
      <section className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <Alert tone="error" className="p-4">
          <div>
            <p className="font-semibold">Não foi possível carregar seu dashboard.</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        </Alert>
        <Button type="button" onClick={reload} className="mt-4">
          Tentar novamente
        </Button>
      </section>
    );
  }

  return (
    <section className="w-full space-y-5 px-4 py-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
        <div className="h-full lg:col-span-5">
          <DashboardKpiCards stats={stats} />
        </div>
        <div className="h-full lg:col-span-7">
          <DashboardStatusChart stats={stats} />
        </div>
      </div>

      <div className="w-full">
        <DashboardRecentTable items={recentPackages} />
      </div>
    </section>
  );
}
