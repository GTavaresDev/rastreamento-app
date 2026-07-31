"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { maskCpf } from "@core/domain/common/utils/formatters/cpf.formatter";
import {
  validateCpf,
  getValidationMessage,
} from "@core/domain/common/utils/validators/cpf.validator";
import {
  getStoredCpf,
  setStoredCpf,
  getStoredUserName,
  setStoredUserName,
} from "@core/infra/store/userStore";

export function useLoginForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [cpf, setCpf] = useState("");
  const [cpfTouched, setCpfTouched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedCpf = getStoredCpf();
    if (storedCpf) {
      setCpf(maskCpf(storedCpf));
    }
    const storedName = getStoredUserName();
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const cpfValidationMessage = getValidationMessage(cpf, cpfTouched);
  const nameValidationMessage =
    nameTouched && !name.trim() ? "Informe seu nome." : "";

  function handleNameChange(value: string) {
    setName(value);
    setError("");
  }

  function handleNameBlur() {
    setNameTouched(true);
  }

  function handleCpfChange(value: string) {
    setCpf(maskCpf(value));
    setError("");
  }

  function handleCpfBlur() {
    setCpfTouched(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNameTouched(true);
    setCpfTouched(true);

    if (!name.trim()) {
      setError("Informe seu nome para continuar.");
      return;
    }

    const validation = validateCpf(cpf);

    if (!validation.valid) {
      setError("Informe um CPF válido para continuar.");
      return;
    }

    setError("");
    setStoredUserName(name);
    setStoredCpf(validation.cleaned);
    router.push("/rastreamento");
  }

  return {
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
  };
}
