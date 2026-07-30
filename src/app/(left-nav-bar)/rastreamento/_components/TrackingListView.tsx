"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PackageList } from "./PackageList";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PackageListLoading } from "./TrackingLoadingStates";
import type { PackageSummary } from "@/types";

type TrackingListViewProps = {
  cpf: string;
};

export function TrackingListView({ cpf }: TrackingListViewProps) {
  const [packages, setPackages] = useState<PackageSummary[]>([]);
  const [scrapedAt, setScrapedAt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let active = true;

    async function fetchPackages() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/tracking?cpf=${encodeURIComponent(cpf)}`);
        if (!response.ok) {
          const errorBody = (await response.json().catch(() => null)) as { error?: string } | null;
          if (active) {
            setError(errorBody?.error || "Não foi possível carregar as encomendas.");
            setPackages([]);
          }
          return;
        }

        const data = (await response.json()) as PackageSummary[];
        if (active) {
          setPackages(data);
          setScrapedAt(new Date().toISOString());
        }
      } catch {
        if (active) {
          setError("Falha de rede ao carregar as encomendas.");
          setPackages([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchPackages();

    return () => {
      active = false;
    };
  }, [cpf]);

  if (loading) {
    return <PackageListLoading />;
  }

  if (error) {
    return (
      <section className="mx-auto flex w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="w-full">
          <Alert tone="error">{error}</Alert>
          <div className="mt-4">
            <Link href="/rastreamento">
              <Button type="button">Buscar novamente</Button>
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
            <Link href="/rastreamento">
              <Button type="button">Buscar outro CPF</Button>
            </Link>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <div className="w-full p-0 m-0">
      <PackageList items={packages} scrapedAt={scrapedAt} cpf={cpf} />
    </div>
  );
}
