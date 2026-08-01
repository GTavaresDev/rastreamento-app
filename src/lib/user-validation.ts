import { z } from "zod";
import { isAccessLevelId } from "@/lib/access-levels";
import { validateCpf } from "@core/domain/common/utils/validators/cpf.validator";

const cpfSchema = z
  .string()
  .trim()
  .min(1, "Informe o CPF.")
  .transform((value) => value.replace(/\D/g, ""))
  .refine((value) => validateCpf(value).valid, "Informe um CPF válido.");

const commonUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome com pelo menos 2 caracteres.")
    .max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(255)
    .regex(/^[^\s@]+@[^\s@]+$/, "Informe um e-mail válido."),
  cpf: cpfSchema,
  permission: z.coerce
    .number()
    .int()
    .refine(isAccessLevelId, "Selecione um nível de acesso válido."),
});

export const createUserSchema = commonUserSchema.extend({
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .max(72),
});

export const updateUserSchema = commonUserSchema.extend({
  password: z
    .string()
    .max(72)
    .optional()
    .transform((value) => (value === "" ? undefined : value))
    .refine(
      (value) => value === undefined || value.length >= 6,
      "A nova senha deve ter pelo menos 6 caracteres.",
    ),
});

export function getValidationError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Dados inválidos.";
}
