/**
 * ============================================================
 * REMINDER DEFAULTS
 * ============================================================
 *
 * Centraliza os valores padrão utilizados na
 * criação dos lembretes da aplicação.
 *
 * Estes valores representam apenas sugestões
 * iniciais e podem ser alterados pelo usuário.
 */

/**
 * Horário sugerido para o primeiro lembrete
 * de hidratação criado pelo sistema.
 */
export const DEFAULT_HYDRATION_TIME = "09:00";

/**
 * Dias da semana sugeridos para novos
 * lembretes de hidratação.
 *
 * Por padrão são considerados apenas os
 * dias úteis.
 */
export const DEFAULT_HYDRATION_DAYS = [
  "seg",
  "ter",
  "qua",
  "qui",
  "sex",
] as const;
