"use client";

import { useDashboardData } from "./_hooks/useDashboardData";
import { DashboardKpiCards } from "./_components/DashboardKpiCards";
import { DashboardStatusChart } from "./_components/DashboardStatusChart";
import { DashboardRecentTable } from "./_components/DashboardRecentTable";
import { PackageListLoading } from "@/app/(left-nav-bar)/rastreamento/_components/TrackingLoadingStates";

export default function DashboardPage() {
  const { activeCpf, recentPackages, stats, loading } = useDashboardData();

  if (loading) {
    return <PackageListLoading />;
  }

  return (
    <section className="w-full px-4 py-4 sm:px-6 lg:px-8 space-y-5">
      {/* Top Section: 4 KPI Status Cards on Left (col-span-5), Distribution Chart on Right (col-span-7) */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
        <div className="h-full lg:col-span-5">
          <DashboardKpiCards stats={stats} />
        </div>
        <div className="h-full lg:col-span-7">
          <DashboardStatusChart stats={stats} />
        </div>
      </div>

      {/* Bottom Section: Single Full-Width Card in Row */}
      <div className="w-full">
        <DashboardRecentTable
          items={recentPackages}
          cpf={activeCpf ?? undefined}
        />
      </div>
    </section>
  );
}
