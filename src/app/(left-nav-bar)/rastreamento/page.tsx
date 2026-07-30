import { CpfSearchForm } from "./_components/CpfSearchForm";
import { TrackingListView } from "./_components/TrackingListView";
import { Card } from "@/components/ui/card";
import { validateCpf } from "@core/domain/common/utils/validators/cpf.validator";
import { PackageSearch } from "lucide-react";

type RastreamentoPageProps = {
  searchParams: Promise<{
    cpf?: string;
  }>;
};

function getSegment(value: string | string[] | undefined) {
  if (!value) return "";
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }
  return value.trim();
}

export default async function RastreamentoPage({
  searchParams,
}: RastreamentoPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawCpf = getSegment(resolvedSearchParams.cpf);

  const cpfValidation = validateCpf(rawCpf);

  if (cpfValidation.valid) {
    return <TrackingListView cpf={cpfValidation.cleaned} />;
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl justify-center px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center">
          <Card className="w-full max-w-lg gap-0 rounded-2xl border border-slate-200 bg-white px-7 pb-8 pt-4 shadow-sm sm:px-9 sm:pb-9 sm:pt-5">
            <div className="mb-7 flex items-center gap-3.5 sm:mb-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                <PackageSearch className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  Buscar encomendas por CPF
                </h1>
              </div>
            </div>
            <CpfSearchForm />
          </Card>
        </div>
      </div>
    </section>
  );
}
