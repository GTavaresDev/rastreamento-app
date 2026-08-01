export const ACCESS_LEVELS = [
  { id: 1, name: "Administrador" },
  { id: 2, name: "Usuário" },
] as const;

export type AccessLevelId = (typeof ACCESS_LEVELS)[number]["id"];

export function isAccessLevelId(value: number): value is AccessLevelId {
  return ACCESS_LEVELS.some((level) => level.id === value);
}

export function getAccessLevelName(value: number) {
  return ACCESS_LEVELS.find((level) => level.id === value)?.name ?? null;
}
