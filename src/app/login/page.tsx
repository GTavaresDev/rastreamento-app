import Image from "next/image";
import { Card } from "@/components/ui/card";
import { LoginForm } from "./_components/LoginForm";
import { APP_NAME } from "@/utils/constants";
import { PackageSearch } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Branding & Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 shadow-md">
            <PackageSearch className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {APP_NAME}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Acesse suas encomendas informando o CPF cadastrado
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <LoginForm />
        </Card>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400">
          Seu CPF será salvo neste navegador para facilitar suas consultas no rastreamento.
        </p>
      </div>
    </main>
  );
}
