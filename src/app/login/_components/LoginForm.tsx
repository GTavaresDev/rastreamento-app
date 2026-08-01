"use client";

import { LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginForm } from "../_hooks/useLoginForm";

export function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Acesse sua conta
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Entre com seu e-mail e senha para continuar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          {/*  E-mail */}
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="pl-10"
              placeholder="Digite seu e-mail"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          {/* Senha */}
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="pl-10"
              placeholder="Digite sua senha"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </p>
        ) : null}

        <Button
          className="h-11 w-full rounded-xl text-sm font-bold"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
