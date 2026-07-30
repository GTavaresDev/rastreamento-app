"use client";

import { Card } from "@/components/ui/card";
import { Package, Truck, CheckCircle2, RotateCcw } from "lucide-react";

type DashboardKpiCardsProps = {
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

export function DashboardKpiCards({ stats }: DashboardKpiCardsProps) {
  const cards = [
    {
      title: "Pedido",
      count: stats.pedidoCount,
      percentage: stats.pedidoPct,
      icon: Package,
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      iconBg: "bg-amber-100 text-amber-600",
      accentBorder: "border-l-amber-500",
    },
    {
      title: "A caminho",
      count: stats.aCaminhoCount,
      percentage: stats.aCaminhoPct,
      icon: Truck,
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      iconBg: "bg-blue-100 text-blue-600",
      accentBorder: "border-l-blue-500",
    },
    {
      title: "Entregue",
      count: stats.entregueCount,
      percentage: stats.entreguePct,
      icon: CheckCircle2,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconBg: "bg-emerald-100 text-emerald-600",
      accentBorder: "border-l-emerald-500",
    },
    {
      title: "Devolvido",
      count: stats.devolvidoCount,
      percentage: stats.devolvidoPct,
      icon: RotateCcw,
      badgeColor: "bg-red-50 text-red-700 border-red-200",
      iconBg: "bg-red-100 text-red-600",
      accentBorder: "border-l-red-500",
    },
  ];

  return (
    <div className="flex h-full flex-col justify-between gap-2.5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className={`relative flex flex-1 flex-row items-center justify-between overflow-hidden border border-slate-200 bg-white px-4 py-2.5 shadow-sm border-l-4 ${card.accentBorder} transition-all hover:shadow-md whitespace-nowrap`}
          >
            {/* Left side: Icon + Status Name: Count */}
            <div className="flex items-center gap-3 whitespace-nowrap">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex items-baseline gap-1.5 text-base font-bold whitespace-nowrap leading-none">
                <span className="text-slate-800">{card.title}:</span>
                <span className="text-slate-950">{card.count}</span>
              </div>
            </div>

            {/* Right side: Percentage Badge */}
            <span
              className={`inline-flex shrink-0 items-center rounded-md border px-2.5 py-1 text-xs font-bold whitespace-nowrap ${card.badgeColor}`}
            >
              {card.percentage}%
            </span>
          </Card>
        );
      })}
    </div>
  );
}
