import { supabase } from "../lib/supabase.js";

/**
 * ============================================================
 * REMINDER DELIVERY REPOSITORY
 * ============================================================
 *
 * Responsável exclusivamente pela persistência das execuções
 * dos lembretes.
 *
 * Não contém:
 *
 * - regras de horário;
 * - regras de dias;
 * - lógica de scheduler;
 * - envio de Push.
 *
 * Essas responsabilidades pertencem às respectivas camadas.
 */

/**
 * Reserva uma ocorrência para processamento.
 *
 * A constraint UNIQUE(reminder_id, scheduled_for)
 * garante a idempotência no banco.
 *
 * Retorno:
 *
 * true  → ocorrência registrada por esta execução.
 * false → ocorrência já havia sido registrada.
 */
export async function claimDelivery(
  reminderId: string,
  scheduledFor: Date,
): Promise<boolean> {
  const { error } = await supabase
    .from("reminder_deliveries")
    .insert({
      reminder_id: reminderId,
      scheduled_for: scheduledFor.toISOString(),
    });

  if (!error) {
    return true;
  }

  /**
   * PostgreSQL 23505 = unique_violation.
   *
   * Nesse caso outra execução já reservou
   * a mesma ocorrência.
   */
  if (error.code === "23505") {
    return false;
  }

  throw new Error(
    `Erro ao registrar execução do lembrete: ${error.message}`,
  );
}
