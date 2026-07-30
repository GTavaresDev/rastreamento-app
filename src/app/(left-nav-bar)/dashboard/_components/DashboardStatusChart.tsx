"use client";

import { Card } from "@/components/ui/card";
import { PieChart } from "lucide-react";

type DashboardStatusChartProps = {
  stats: {
    total: number;
    pedidoCount: number;
    aCaminhoCount: number;
    entregueCount: number;
    devolvidoCount: number;
    pedidoPct: number;
    aCaminhoPct: number;
    entreguePct: number;
    devolvidoPct: number;
  };
};

export function DashboardStatusChart({ stats }: DashboardStatusChartProps) {
  const items = [
    {
      label: "Pedido",
      count: stats.pedidoCount,
      percentage: stats.pedidoPct,
      color: "bg-amber-500",
      textColor: "text-amber-700",
      badgeBg: "bg-amber-50",
      stroke: "#f59e0b",
    },
    {
      label: "A caminho",
      count: stats.aCaminhoCount,
      percentage: stats.aCaminhoPct,
      color: "bg-blue-500",
      textColor: "text-blue-700",
      badgeBg: "bg-blue-50",
      stroke: "#3b82f6",
    },
    {
      label: "Entregue",
      count: stats.entregueCount,
      percentage: stats.entreguePct,
      color: "bg-emerald-500",
      textColor: "text-emerald-700",
      badgeBg: "bg-emerald-50",
      stroke: "#10b981",
    },
    {
      label: "Devolvido",
      count: stats.devolvidoCount,
      percentage: stats.devolvidoPct,
      color: "bg-red-500",
      textColor: "text-red-700",
      badgeBg: "bg-red-50",
      stroke: "#ef4444",
    },
  ];

  // Calculate SVG Conic / Donut Stroke Offsets
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let strokeDashoffsetAccumulator = 0;

  const donutSegments = items.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const offset = strokeDashoffsetAccumulator;
    strokeDashoffsetAccumulator -= (item.percentage / 100) * circumference;

    return {
      ...item,
      strokeDasharray,
      strokeDashoffset: offset,
    };
  });

  return (
    <Card className="flex h-full flex-col justify-between border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              Distribuição por Status
            </h2>
            <p className="text-xs text-slate-500">
              Porcentagem das encomendas por estado de entrega
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <PieChart className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-5 md:flex-row md:items-center">
          {/* SVG Donut Chart (Thinner stroke: 7) */}
          <div className="relative flex items-center justify-center">
            <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="7"
                fill="transparent"
              />
              {/* Segments */}
              {stats.total > 0 ? (
                donutSegments.map((segment) => (
                  <circle
                    key={segment.label}
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={segment.stroke}
                    strokeWidth="7"
                    strokeDasharray={segment.strokeDasharray}
                    strokeDashoffset={segment.strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                ))
              ) : null}
            </svg>

            {/* Center Info */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
                {stats.total}
              </span>
              <span className="mt-0.5 text-xs font-medium text-slate-400">
                {stats.total === 1 ? "Pacote" : "Pacotes"}
              </span>
            </div>
          </div>

          {/* Status Percentage Progress Bars & Legend */}
          <div className="w-full flex-1 space-y-2.5">
            {items.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                    />
                    <span className="text-sm text-slate-800 font-semibold">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono">
                      {item.count} {item.count === 1 ? "item" : "itens"}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 font-bold text-xs ${item.badgeBg} ${item.textColor}`}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar line */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
