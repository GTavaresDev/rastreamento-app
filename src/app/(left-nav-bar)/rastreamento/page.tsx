"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRequireCpfAuth } from "@/app/login/_hooks/useRequireCpfAuth";
import { PackageListLoading } from "./_components/TrackingLoadingStates";
import { PackageList } from "./_components/TrackingResultsList";
import { useTrackingData } from "./_hooks/useTrackingData";

export default function RastreamentoPage() {
  const searchParams = useSearchParams();
  const rawCpf = searchParams.get("cpf") ?? "";

  const { activeCpf, isChecking } = useRequireCpfAuth(rawCpf);
  const { packages, scrapedAt, loading, error } = useTrackingData(
    activeCpf ?? ""
  );

  if (isChecking || (activeCpf && loading)) {
    return <PackageListLoading />;
  }

  if (!activeCpf) {
    return null;
  }

  if (error) {
    return (
      <section className="mx-auto flex w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="w-full">
          <Alert tone="error">{error}</Alert>
          <div className="mt-4">
            <Link href="/login">
              <Button type="button">Tentar outro CPF</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (packages.length === 0) {
    return (
      <section className="mx-auto flex w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <Card className="mx-auto w-full max-w-3xl p-8 text-center sm:p-10">
          <p className="text-4xl">📦</p>
          <h1 className="mt-4 text-xl font-semibold text-slate-900">
            Nenhuma encomenda encontrada para este CPF.
          </h1>
          <p className="mt-2 text-slate-500">
            O SSW não retornou pacotes vinculados ao CPF informado.
          </p>
          <div className="mt-6">
            <Link href="/login">
              <Button type="button">Alterar CPF</Button>
            </Link>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <div className="w-full p-0 m-0">
      <PackageList items={packages} scrapedAt={scrapedAt} cpf={activeCpf} />
    </div>
  );
}
