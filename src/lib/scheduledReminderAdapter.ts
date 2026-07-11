import type { ScheduledReminder } from "../types/scheduledReminder";

/**
 * ============================================================
 * DB SCHEDULED REMINDER
 * ============================================================
 *
 * Representa exatamente o formato retornado pela
 * tabela scheduled_reminders.
 *
 * Este tipo deve refletir a estrutura do banco
 * de dados, mantendo os nomes das colunas em
 * snake_case.
 *
 * Toda conversão para o modelo utilizado pela
 * aplicação deve ocorrer através deste adapter.
 */
export type DbScheduledReminder = {
  id: string;

  label: string | null;

  time: string | null;

  days: string[] | null;

  active: boolean | null;

  category: "mood" | "hydration";

  is_fixed: boolean;
};

/**
 * ============================================================
 * CONSTANTES
 * ============================================================
 *
 * Dias da semana utilizados como valor padrão
 * quando um lembrete não possui dias
 * configurados no banco.
 *
 * Atualmente os lembretes fixos são criados
 * com days = NULL.
 *
 * Para a interface isso representa um lembrete
 * válido para todos os dias da semana.
 */
const DEFAULT_WEEK_DAYS = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

/**
 * ============================================================
 * DB → DOMAIN
 * ============================================================
 *
 * Converte um registro da tabela
 * scheduled_reminders para o modelo utilizado
 * pela aplicação.
 *
 * Responsabilidades:
 *
 * • converter snake_case para camelCase;
 * • normalizar valores nulos;
 * • ocultar detalhes do banco da camada de UI.
 *
 * A partir deste ponto a interface nunca deverá
 * conhecer o formato original retornado pelo
 * Supabase.
 */
export function toScheduledReminder(
  reminder: DbScheduledReminder,
): ScheduledReminder {
  return {
    id: reminder.id,

    label: reminder.label ?? "",

    time: reminder.time ?? "00:00",

    days: reminder.days ?? DEFAULT_WEEK_DAYS,

    active: reminder.active ?? false,

    category: reminder.category,

    isFixed: reminder.is_fixed,
  };
}
