"use client";

import { useEffect, useSyncExternalStore } from "react";
import { validateCpf } from "@core/domain/common/utils/validators/cpf.validator";
import { getStoredCpf, getStoredUserName, setStoredCpf } from "@core/infra/store/userStore";

function subscribeToStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getServerSnapshot() {
  return null;
}

export function useRequireCpfAuth(initialCpf?: string | null) {
  const storedCpf = useSyncExternalStore(
    subscribeToStorage,
    getStoredCpf,
    getServerSnapshot,
  );
  const userName =
    useSyncExternalStore(
      subscribeToStorage,
      getStoredUserName,
      getServerSnapshot,
    ) ?? "";

  const initialValidation = initialCpf ? validateCpf(initialCpf) : null;
  const storedValidation = storedCpf ? validateCpf(storedCpf) : null;
  const initialCleaned = initialValidation?.valid
    ? initialValidation.cleaned
    : null;
  const activeCpf = initialValidation?.valid
    ? initialValidation.cleaned
    : storedValidation?.valid
      ? storedValidation.cleaned
      : null;

  useEffect(() => {
    if (initialCleaned) {
      setStoredCpf(initialCleaned);
    }
  }, [initialCleaned]);

  return { activeCpf, userName, isChecking: false };
}
