"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  removeStoredUser,
  setStoredCpf,
  setStoredUserName,
} from "@core/infra/store/userStore";

type LoginResponse = {
  error?: string;
  user?: {
    name: string;
    cpf: string;
  };
};

export function useLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Informe seu e-mail e senha.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as LoginResponse;

      if (!response.ok || !data.user) {
        setError(data.error ?? "Não foi possível entrar.");
        return;
      }

      removeStoredUser();
      setStoredUserName(data.user.name);
      setStoredCpf(data.user.cpf);
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  };
}
