const CPF_STORAGE_KEY = "user_cpf";
const NAME_STORAGE_KEY = "user_name";

export function getStoredCpf(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CPF_STORAGE_KEY);
}

export function setStoredCpf(cpf: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CPF_STORAGE_KEY, cpf);
}

export function getStoredUserName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(NAME_STORAGE_KEY);
}

export function setStoredUserName(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NAME_STORAGE_KEY, name.trim());
}

export function removeStoredUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CPF_STORAGE_KEY);
  localStorage.removeItem(NAME_STORAGE_KEY);
}
