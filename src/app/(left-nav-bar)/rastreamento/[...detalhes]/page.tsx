"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useRequireCpfAuth } from "@/app/login/_hooks/useRequireCpfAuth";
import { useTrackingDetail } from "../_hooks/useTrackingDetail";
import { PackageDetail } from "../_components/PackageDetail";
import { PackageDetailLoading } from "../_components/TrackingLoadingStates";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function RastreamentoDetalhesPage() {
  const params = useParams<{ detalhes?: string[] }>();
  const searchParams = useSearchParams();

  const detalhesSegments = params.detalhes ?? [];
  const trackingId = detalhesSegments[detalhesSegments.length - 1] ?? "";
  const queryCpf = searchParams.get("cpf") ?? "";

  const { activeCpf, isChecking } = useRequireCpfAuth(queryCpf);
  const { item, loading, error } = useTrackingDetail(
    trackingId,
    activeCpf ?? undefined
  );

  if (isChecking || loading) {
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
