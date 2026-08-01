"use client";

import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PackageListLoading } from "./_components/TrackingLoadingStates";
import { PackageList } from "./_components/TrackingResultsList";
import { useTrackingData } from "./_hooks/useTrackingData";

export default function RastreamentoPage() {
  const { packages, scrapedAt, loading, error } = useTrackingData();

  if (loading) {
    return <PackageListLoading />;
  }

  if (error) {
    return (
      <section className="mx-auto flex w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="w-full">
          <Alert tone="error">{error}</Alert>
          <div className="mt-4">
            <Link href="/dashboard">
              <Button type="button">Voltar ao início</Button>
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
            <Link href="/dashboard">
              <Button type="button">Voltar ao início</Button>
            </Link>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <div className="w-full p-0 m-0">
      <PackageList items={packages} scrapedAt={scrapedAt} />
    </div>
  );
}
