/**
 * ============================================================
 * WEEK DAYS
 * ============================================================
 *
 * Dias da semana utilizados pela configuração
 * de lembretes da aplicação.
 */
export const WEEK_DAYS = [
  { id: "seg", label: "Seg" },
  { id: "ter", label: "Ter" },
  { id: "qua", label: "Qua" },
  { id: "qui", label: "Qui" },
  { id: "sex", label: "Sex" },
  { id: "sab", label: "Sab" },
  { id: "dom", label: "Dom" },
] as const;

/**
 * ============================================================
 * DEFAULT HYDRATION DAYS
 * ============================================================
 *
 * Dias utilizados como configuração inicial
 * para novos lembretes de hidratação.
 *
 * O usuário pode alterar esses dias durante
 * a criação do lembrete.
 */
export const DEFAULT_HYDRATION_DAYS = [
  "seg",
  "ter",
  "qua",
  "qui",
  "sex",
] as const;
