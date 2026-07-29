import { redirect } from "next/navigation";
import Tracking from "@/components/pages/Tracking";
import { validateCpf } from "@core/domain/common/utils/validators/cpf.validator";

type RastreamentoCpfPageProps = {
  params: Promise<{
    cpf: string;
  }>;
};

function getSegment(value: string | string[]) {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value.trim();
}

export default async function RastreamentoCpfPage({
  params,
}: RastreamentoCpfPageProps) {
  const resolvedParams = await params;
  const rawCpf = getSegment(resolvedParams.cpf);

  const cpfValidation = validateCpf(rawCpf);

  if (!cpfValidation.valid) {
    redirect("/");
  }

  return <Tracking cpf={cpfValidation.cleaned} />;
}
