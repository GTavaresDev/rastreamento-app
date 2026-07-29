"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PackageDetail } from "@/components/tracking/PackageDetail";
import { PackageDetailLoading } from "@/components/tracking/TrackingLoadingStates";
import { useTracking } from "@/components/tracking/TrackingProvider";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import type {
  PackageDetail as PackageDetailType,
  TrackingDetailResponse,
  TrackingError,
} from "@/types";

export function TrackingDetailView() {
  const params = useParams<{ id: string }>();
  const trackingId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { hydrated, cpf, details, saveDetail } = useTracking();
  const [item, setItem] = useState<PackageDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!cpf || !trackingId) {
      setItem(null);
      setLoading(false);
      setError("Dados não disponíveis. Busque novamente pelo CPF.");
      return;
    }

    const cachedDetail = details?.[trackingId];
    if (cachedDetail) {
      setItem(cachedDetail);
      setLoading(false);
      return;
    }

    let active = true;

    async function loadDetail() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          cpf,
          trackingId,
        });
        const response = await fetch(`/api/tracking/detail?${params}`);

        const payload = (await response.json()) as
          | TrackingDetailResponse
          | TrackingError;

        if (!payload.success || !response.ok) {
          if (!active) {
            return;
          }

          setItem(null);
          setError(
            payload.success
              ? "Não foi possível carregar os detalhes da encomenda."
              : payload.error ||
              "Não foi possível carregar os detalhes da encomenda.",
          );
          return;
        }

        if (!active) {
          return;
        }

        setItem(payload.data);
        saveDetail(trackingId, payload.data);
      } catch {
        if (!active) {
          return;
        }

        setItem(null);
        setError("Falha de rede ao carregar os detalhes. Tente novamente.");
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
  }, [hydrated, cpf, trackingId, details, saveDetail]);

  if (!hydrated || loading) {
    return <PackageDetailLoading />;
  }

  if (error || !item) {
    return (
      <section className="mx-auto flex w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="w-full">
          <Alert>
            {error || "Dados não disponíveis. Busque novamente pelo CPF."}
          </Alert>
          <div className="mt-4">
            <Link href="/">
              <Button type="button">Ir para a busca</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const backHref = cpf
    ? `/rastreamento/${encodeURIComponent(cpf)}`
    : "/";

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 sm:mb-8">
          <Link
            href={backHref}
            className="inline-flex w-fit items-center justify-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
          >
            ← Voltar para lista
          </Link>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Rastreamento por CPF
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Detalhes da encomenda
            </h1>
          </div>
        </div>
        <div className="mt-6">
          <PackageDetail item={item} />
        </div>
      </div>
    </section>
  );
}
