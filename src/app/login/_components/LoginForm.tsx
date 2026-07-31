"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginForm } from "../_hooks/useLoginForm";

export function LoginForm() {
  const {
    name,
    nameValidationMessage,
    handleNameChange,
    handleNameBlur,
    cpf,
    cpfValidationMessage,
    handleCpfChange,
    handleCpfBlur,
    error,
    handleSubmit,
  } = useLoginForm();

  const hasAnyError = Boolean(nameValidationMessage || cpfValidationMessage);

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        Encontre suas encomendas
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Grouped Single Container for Name and CPF */}
        <div>
          <div
            className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900 ${
              hasAnyError ? "border-red-300" : "border-slate-300"
            }`}
          >
            {/* Top Field: Seu nome */}
            <div className="relative border-b border-slate-200">
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Seu nome"
                value={name}
                hasError={Boolean(nameValidationMessage)}
                className="h-[55px] w-full rounded-none border-0 bg-transparent px-5 text-base text-slate-900 shadow-none placeholder:text-slate-400 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(event) => handleNameChange(event.target.value)}
                onBlur={handleNameBlur}
                aria-invalid={Boolean(nameValidationMessage)}
              />
            </div>

            {/* Bottom Field: CPF do destinatário */}
            <div className="relative">
              <Input
                id="cpf"
                name="cpf"
                aria-label="CPF"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="CPF do destinatário"
                value={cpf}
                hasError={Boolean(cpfValidationMessage)}
                className="h-[55px] w-full rounded-none border-0 bg-transparent px-5 text-base text-slate-900 shadow-none placeholder:text-slate-400 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(event) => handleCpfChange(event.target.value)}
                onBlur={handleCpfBlur}
                maxLength={14}
                aria-invalid={Boolean(cpfValidationMessage)}
                aria-describedby={cpfValidationMessage ? "cpf-error" : undefined}
              />
            </div>
          </div>

          {/* Validation Errors */}
          {nameValidationMessage ? (
            <p className="mt-1.5 px-1 text-xs font-medium text-red-600">
              {nameValidationMessage}
            </p>
          ) : null}

          {cpfValidationMessage ? (
            <p id="cpf-error" className="mt-1.5 px-1 text-xs font-medium text-red-600">
              {cpfValidationMessage}
            </p>
          ) : null}
        </div>

        {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}

        <Button
          className="h-[55px] w-full rounded-2xl bg-slate-900 text-base font-bold text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-500"
          type="submit"
        >
          Entrar e buscar encomendas
        </Button>
      </form>
    </div>
  );
}
