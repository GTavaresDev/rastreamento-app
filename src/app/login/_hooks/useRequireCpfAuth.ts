"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { validateCpf } from "@core/domain/common/utils/validators/cpf.validator";
import { getStoredCpf, setStoredCpf, getStoredUserName } from "@core/infra/store/userStore";

export function useRequireCpfAuth(initialCpf?: string | null) {
  const router = useRouter();
  const [activeCpf, setActiveCpf] = useState<string | null>(
    initialCpf ?? null
  );
  const [userName, setUserName] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(!initialCpf);

  useEffect(() => {
    const storedName = getStoredUserName() ?? "";
    setUserName(storedName);

    if (initialCpf) {
      const validation = validateCpf(initialCpf);
      if (validation.valid) {
        setStoredCpf(validation.cleaned);
        setActiveCpf(validation.cleaned);
        setIsChecking(false);
        return;
      }
    }

    const storedCpf = getStoredCpf();
    if (storedCpf && validateCpf(storedCpf).valid) {
      setActiveCpf(storedCpf);
      setIsChecking(false);
      return;
    }

    router.replace("/login");
  }, [initialCpf, router]);

  return { activeCpf, userName, isChecking };
}
