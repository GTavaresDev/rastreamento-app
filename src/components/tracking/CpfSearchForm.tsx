"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTracking } from "@/components/tracking/TrackingProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { PackageSummary } from "@/types";
import { maskCpf, onlyDigits } from "@core/domain/common/utils/formatters/cpf.formatter";
import { validateCpf } from "@core/domain/common/utils/validators/cpf.validator";

function getValidationMessage(cpf: string, touched: boolean): string {
  if (!touched) {
    return "";
  }

  const digits = onlyDigits(cpf);

  if (digits.length === 0) {
    return "";
  }

  if (digits.length < 11) {
    return "";
  }

  return validateCpf(cpf).valid ? "" : "CPF inválido";
}

export function CpfSearchForm() {
  const router = useRouter();
  const tracking = useTracking();
  const [cpf, setCpf] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validationMessage = getValidationMessage(cpf, touched);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    const validation = validateCpf(cpf);

    if (!validation.valid) {
      setError("Informe um CPF válido para continuar.");
      return;
    }

    if (
      tracking.cpf === validation.cleaned &&
      tracking.payload.packages.length > 0
    ) {
      router.push(`/rastreamento/${encodeURIComponent(validation.cleaned)}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/tracking?cpf=${encodeURIComponent(validation.cleaned)}`,
      );

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(
          errorBody?.error ||
          "Não foi possível buscar as encomendas no momento. Tente novamente.",
        );
        return;
      }

      const packages = (await response.json()) as PackageSummary[];

      tracking.setTrackingResult({
        cpf: validation.cleaned,
        payload: { packages },
        scrapedAt: new Date().toISOString(),
      });
      router.push(`/rastreamento/${encodeURIComponent(validation.cleaned)}`);
    } catch {
      setError("Falha de rede ao consultar o rastreamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          id="cpf"
          name="cpf"
          aria-label="CPF"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          list={tracking.cpf ? "recent-cpf-list" : undefined}
          placeholder="000.000.000-00"
          value={cpf}
          hasError={Boolean(validationMessage)}
          onChange={(event) => {
            setCpf(maskCpf(event.target.value));
            setError("");
          }}
          onBlur={() => {
            setTouched(true);
          }}
          maxLength={14}
          aria-invalid={Boolean(validationMessage)}
          aria-describedby={validationMessage ? "cpf-error" : undefined}
        />
        {tracking.cpf ? (
          <datalist id="recent-cpf-list">
            <option value={maskCpf(tracking.cpf)} />
          </datalist>
        ) : null}

        {validationMessage ? (
          <p id="cpf-error" className="text-sm text-red-600">
            {validationMessage}
          </p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button
        className="w-full bg-black hover:bg-neutral-900 focus-visible:ring-neutral-500"
        disabled={loading}
        type="submit"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Buscando...
          </>
        ) : (
          "Buscar encomendas"
        )}
      </Button>
    </form>
  );
}
