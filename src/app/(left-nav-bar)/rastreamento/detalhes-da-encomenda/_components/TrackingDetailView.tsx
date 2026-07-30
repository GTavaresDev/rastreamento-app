"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PackageDetail } from "./PackageDetail";
import { PackageDetailLoading } from "../../_components/TrackingLoadingStates";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type {
  PackageDetail as PackageDetailType,
  TrackingDetailResponse,
  TrackingError,
} from "@/types";

export function TrackingDetailView() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const trackingId = Array.isArray(params.id) ? params.id[0] : params.id;
  const cpf = searchParams.get("cpf") ?? "";

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
        const queryParams = new URLSearchParams({ trackingId });
        if (cpf) {
          queryParams.set("cpf", cpf);
        }

        const response = await fetch(`/api/tracking/detail?${queryParams}`);
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
  }, [trackingId, cpf]);

  if (loading) {
    return <PackageDetailLoading />;
  }

  if (error || !item) {
    return (
      <section className="mx-auto flex w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="w-full">
          <Alert tone="error">
            {error || "Dados não disponíveis. Busque novamente pelo CPF."}
          </Alert>
          <div className="mt-4">
            <Link href="/rastreamento">
              <Button type="button">Ir para a busca</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-xl">
        <PackageDetail item={item} />
      </div>
    </section>
  );
}
