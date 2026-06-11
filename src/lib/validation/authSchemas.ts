import { z } from "zod";
/**
 * ============================================================
 * PASSWORD SCHEMA
 * ============================================================
 *
 * Política de senha utilizada em toda aplicação.
 *
 * Regras:
 *
 * - mínimo 8 caracteres
 * - pelo menos uma letra minúscula
 * - pelo menos uma letra maiúscula
 * - pelo menos um número
 * - pelo menos um caractere especial
 *
 * Exemplos válidos:
 *
 * Senha@123
 * Fluidity#2026
 * MinhaSenha!1
 */
const passwordSchema = z
  .string()
  .min(
    8,
    "Senha deve possuir pelo menos 8 caracteres"
  )
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
    "A senha deve conter letra maiúscula, letra minúscula, número e caractere especial"
  );

/**
 * ============================================================
 * LOGIN SCHEMA
 * ============================================================
 *
 * Regras:
 * - e-mail obrigatório
 * - e-mail válido
 * - senha obrigatória
 */
export const loginSchema = z.object({
  email: z
    .email("Informe um e-mail válido")
    .trim(),

  password: z
    .string()
    .min(1, "Informe sua senha"),
});

/**
 * ============================================================
 * CADASTRO SCHEMA
 * ============================================================
 *
 * Regras:
 * - nome obrigatório
 * - mínimo 3 caracteres
 * - e-mail válido
 * - senha mínima de 8 caracteres
 * - confirmação obrigatória
 * - senhas devem coincidir
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Nome deve possuir pelo menos 3 caracteres"),

    email: z
      .email("Informe um e-mail válido")
      .trim(),

    password: passwordSchema,

    confirmPassword: z
      .string()
      .min(1, "Confirme sua senha"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
    }
  );

/**
 * ============================================================
 * RECUPERAÇÃO DE SENHA SCHEMA
 * ============================================================
 *
 * Regras:
 * - e-mail obrigatório
 * - e-mail válido
 */
export const resetPasswordSchema = z.object({
  email: z
    .email("Informe um e-mail válido")
    .trim(),
});

/**
 * ============================================================
 * TYPES DERIVADOS DOS SCHEMAS
 * ============================================================
 *
 * Mantém sincronismo automático entre:
 * - validação
 * - formulários
 * - tipagem TypeScript
 */
export type LoginFormData =
  z.infer<typeof loginSchema>;

export type RegisterFormData =
  z.infer<typeof registerSchema>;

export type ResetPasswordFormData =
  z.infer<typeof resetPasswordSchema>;
  
/**
 * ============================================================
 * NOVA SENHA SCHEMA
 * ============================================================
 *
 * Regras:
 * - senha obrigatória
 * - mínimo 8 caracteres
 * - confirmação obrigatória
 * - senhas devem coincidir
 */
export const updatePasswordSchema = z
  .object({
    password: passwordSchema,

    confirmPassword: z
      .string()
      .min(
        1,
        "Confirme sua senha"
      ),
  })
  .refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      message:
        "As senhas não coincidem",
      path: ["confirmPassword"],
    }
  );

export type UpdatePasswordFormData =
  z.infer<
    typeof updatePasswordSchema
  >;
  