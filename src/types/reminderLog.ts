/**
 * ============================================================
 * REMINDER LOG
 * ============================================================
 *
 * Representa uma interação do usuário com um lembrete.
 *
 * Cada ação gera um novo registro.
 */
export type ReminderLog = {
  id: string;

  /**
   * Referência ao lembrete
   */
  reminder_id: string;

  /**
   * Tipo de ação realizada
   */
  action: "accepted" | "postponed";

  /**
   * Data da interação
   */
  created_at: string;
};
