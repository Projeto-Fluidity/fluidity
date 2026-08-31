import { supabase } from "../lib/supabase.js";

/**
 * ============================================================
 * REMINDER SETTINGS SERVICE
 * ============================================================
 *
 * Responsável por consultar as configurações globais
 * necessárias ao processamento automático dos lembretes.
 *
 * Neste momento, apenas `enabled` participa do fluxo.
 *
 * Não é responsável por:
 *
 * - buscar lembretes;
 * - avaliar horários;
 * - controlar execuções;
 * - enviar Push Notifications.
 */

/**
 * Verifica se as notificações de lembretes estão
 * habilitadas para o usuário.
 */
export async function isReminderEnabled(
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("reminder_settings")
    .select("enabled")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Erro ao buscar configurações de lembretes: ${error.message}`,
    );
  }

  return data?.enabled ?? false;
}
