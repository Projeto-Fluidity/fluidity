/**
 * ============================================================
 * REMINDER CATEGORY
 * ============================================================
 *
 * Representa as categorias disponíveis para os
 * Lembretes Inteligentes.
 *
 * Neste momento as categorias possuem finalidade
 * exclusivamente de navegação.
 *
 * Futuramente poderão ser utilizadas para:
 *
 * - filtros;
 * - configurações específicas;
 * - personalização de notificações;
 * - segmentação de lembretes.
 *
 * Manter esta tipagem centralizada evita:
 *
 * - strings mágicas espalhadas pelo sistema;
 * - inconsistências entre telas;
 * - erros de digitação.
 */

export type ReminderCategory =
  | "hydration"
  | "mood"
  | "break"
  | "relax";
  