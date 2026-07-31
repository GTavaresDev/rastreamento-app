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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nome Input */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-semibold text-slate-700">
          Seu nome
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Digite seu nome completo"
          value={name}
          hasError={Boolean(nameValidationMessage)}
          className="h-[55px] rounded-xl border-slate-200 bg-white px-4 text-base shadow-sm placeholder:text-slate-400"
          onChange={(event) => handleNameChange(event.target.value)}
          onBlur={handleNameBlur}
          aria-invalid={Boolean(nameValidationMessage)}
        />
        {nameValidationMessage ? (
          <p className="text-xs font-medium text-red-600">
            {nameValidationMessage}
          </p>
        ) : null}
      </div>

      {/* CPF Input */}
      <div className="space-y-1.5">
        <label htmlFor="cpf" className="text-sm font-semibold text-slate-700">
          CPF do destinatário
        </label>
        <Input
          id="cpf"
          name="cpf"
          aria-label="CPF"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="Digite seu CPF (ex: 000.000.000-00)"
          value={cpf}
          hasError={Boolean(cpfValidationMessage)}
          className="h-[55px] rounded-xl border-slate-200 bg-white px-4 text-base shadow-sm placeholder:text-slate-400"
          onChange={(event) => handleCpfChange(event.target.value)}
          onBlur={handleCpfBlur}
          maxLength={14}
          aria-invalid={Boolean(cpfValidationMessage)}
          aria-describedby={cpfValidationMessage ? "cpf-error" : undefined}
        />
        {cpfValidationMessage ? (
          <p id="cpf-error" className="text-xs font-medium text-red-600">
            {cpfValidationMessage}
          </p>
        ) : null}
      </div>

      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}

      <Button
        className="h-[55px] w-full rounded-xl bg-slate-900 text-base font-bold text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-500"
        type="submit"
      >
        Entrar e buscar encomendas
      </Button>
    </form>
  );
}
