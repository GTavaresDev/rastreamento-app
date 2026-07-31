export function logError<TCode extends string>(
  code: TCode,
  message: string,
  details?: unknown
): never {
  console.error(`[ERROR] [${code}] ${message}`, details ?? "");
  const error = Object.assign(new Error(message), { code });
  throw error;
}
