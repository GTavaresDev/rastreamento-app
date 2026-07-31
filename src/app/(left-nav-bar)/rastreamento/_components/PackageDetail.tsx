"use client";

import { useState } from "react";
import type { PackageDetail as PackageDetailType } from "@/types";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/app/(left-nav-bar)/rastreamento/_components/StatusBadge";
import { ChevronDown } from "lucide-react";
import { TrackingTimeline } from "./TrackingTimeline";

type PackageDetailProps = {
  item: PackageDetailType;
};

const progressSteps = ["Pedido", "A caminho", "Entregue"] as const;

function getProgressIndex(status: string) {
  if (status === "entregue") {
    return 2;
  }

  if (status === "em_transito" || status === "em_transferencia") {
    return 1;
  }

  if (status === "pendente") {
    return 0;
  }

  return -1;
}

export function PackageDetail({ item }: PackageDetailProps) {
  const [showDetails, setShowDetails] = useState(false);
  const latestEvent = item.events[0];
  const progressIndex = getProgressIndex(item.currentStatus);

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="p-6 sm:p-8">
        <div className="grid items-start gap-y-6 text-left sm:grid-cols-[minmax(100px,0.5fr)_minmax(0,1.65fr)_minmax(145px,0.8fr)] sm:gap-x-3">
          <div className="min-w-0">
            <p className="text-[11px] font-normal uppercase tracking-[0.18em] text-slate-600">
              Nota fiscal
            </p>
            <p className="mt-1.5 whitespace-nowrap truncate text-base font-bold leading-6 text-slate-900">
              {item.nfNumber}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-normal uppercase tracking-[0.18em] text-slate-600">
              Remetente
            </p>
            <p
              className="mt-1.5 whitespace-nowrap truncate text-base font-bold leading-6 text-slate-900"
              title={item.recipient}
            >
              {item.recipient}
            </p>
          </div>

          <div className="min-w-0">
            <p className="whitespace-nowrap text-[11px] font-normal uppercase tracking-[0.18em] text-slate-600">
              Última ocorrência
            </p>
            <p className="mt-1.5 text-base font-bold leading-6 text-slate-900">
              {latestEvent?.dateTime || "Data indisponível"}
            </p>
          </div>
        </div>

        {!showDetails ? (
          <div className="mt-8 border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Status da encomenda
              </p>
              <StatusBadge status={item.currentStatus} />
            </div>

            <ol
              className="mt-6 grid grid-cols-3"
              aria-label="Progresso da encomenda"
            >
              {progressSteps.map((step, index) => {
                const reached = index <= progressIndex;
                const isCurrent = index === progressIndex;

                return (
                  <li
                    key={step}
                    className="flex min-w-0 flex-col items-center text-center"
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <div className="flex w-full items-center">
                      <span
                        className={`h-0.5 flex-1 ${
                          index === 0
                            ? "bg-transparent"
                            : reached
                              ? "bg-green-500"
                              : "bg-slate-200"
                        }`}
                      />
                      <span
                        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                          reached
                            ? "border-green-500 bg-green-500"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {reached ? (
                          <span className="h-1 w-1 rounded-full bg-white" />
                        ) : null}
                      </span>
                      <span
                        className={`h-0.5 flex-1 ${
                          index === progressSteps.length - 1
                            ? "bg-transparent"
                            : index < progressIndex
                              ? "bg-green-500"
                              : "bg-slate-200"
                        }`}
                      />
                    </div>
                    <span
                      className={`mt-2 text-xs font-semibold ${
                        reached ? "text-green-700" : "text-slate-400"
                      }`}
                    >
                      {step}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : null}
      </div>

      {showDetails ? (
        <div
          id="tracking-timeline"
          className="border-t border-slate-200 px-6 py-7 sm:px-8 sm:py-8"
        >
          <TrackingTimeline events={item.events} />
        </div>
      ) : null}

      <button
        type="button"
        aria-expanded={showDetails}
        aria-controls="tracking-timeline"
        onClick={() => setShowDetails((current) => !current)}
        className="flex cursor-pointer items-center justify-between border-t border-slate-200 px-6 py-5 text-sm font-semibold text-blue-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 sm:px-8"
      >
        <span>{showDetails ? "Ocultar detalhes" : "Ver detalhes"}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            showDetails ? "rotate-180" : ""
          }`}
        />
      </button>
    </Card>
  );
}
