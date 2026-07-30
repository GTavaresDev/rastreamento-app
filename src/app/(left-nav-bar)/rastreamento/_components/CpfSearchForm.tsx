"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [cpf, setCpf] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");

  const validationMessage = getValidationMessage(cpf, touched);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    const validation = validateCpf(cpf);

    if (!validation.valid) {
      setError("Informe um CPF válido para continuar.");
      return;
    }

    setError("");
    router.push(`/rastreamento?cpf=${encodeURIComponent(validation.cleaned)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="cpf"
          className="sr-only"
        >
          CPF do destinatário
        </label>
        <Input
          id="cpf"
          name="cpf"
          aria-label="CPF"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="Digite seu CPF"
          value={cpf}
          hasError={Boolean(validationMessage)}
          className="h-14 rounded-xl border-slate-200 bg-white px-5 text-lg shadow-sm placeholder:text-slate-500 sm:h-16"
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

        {validationMessage ? (
          <p id="cpf-error" className="text-sm text-red-600">
            {validationMessage}
          </p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button
        className="h-14 w-full rounded-xl bg-slate-900 text-base font-bold text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-500 sm:h-16"
        type="submit"
      >
        Buscar encomendas
      </Button>
    </form>
  );
}
