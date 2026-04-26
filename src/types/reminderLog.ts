/**
 * ============================================================
 * REMINDER LOG
 * ============================================================
 *
 * Representa uma interação do usuário com um lembrete.
 *
 * Cada ação gera um novo registro.
 *
 * Observação:
 * - device_id pode ser null para registros antigos
 *   (antes da migração para identificação por dispositivo)
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
   * Data da interação (ISO string)
   */
  created_at: string;

  /**
   * Identificador do dispositivo
   */
  device_id: string | null;
};
