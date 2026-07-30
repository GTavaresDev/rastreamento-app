import { redirect } from "next/navigation";
import { Suspense } from "react";
import { TrackingDetailView } from "@/app/(left-nav-bar)/rastreamento/detalhes-da-encomenda/_components/TrackingDetailView";
import { PackageDetailLoading } from "@/app/(left-nav-bar)/rastreamento/_components/TrackingLoadingStates";
import { validateCpf } from "@core/domain/common/utils/validators/cpf.validator";

type RastreamentoDetalhesPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getSegment(value: string | string[]) {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value.trim();
}

export default async function RastreamentoDetalhesPage({
  params,
}: RastreamentoDetalhesPageProps) {
  const resolvedParams = await params;
  const id = getSegment(resolvedParams.id);

  if (!id) {
    redirect("/");
  }

  const cpfValidation = validateCpf(id);

  if (cpfValidation.valid) {
    redirect(`/rastreamento?cpf=${encodeURIComponent(cpfValidation.cleaned)}`);
  }

  return (
    <Suspense fallback={<PackageDetailLoading />}>
      <TrackingDetailView />
    </Suspense>
  );
}
