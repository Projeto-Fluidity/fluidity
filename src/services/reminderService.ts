import { supabase } from "./supabaseClient";

import type { Reminder } from "../types/reminder";

import { ensureFixedReminders } from "./scheduledReminderService";

import { toUiReminder } from "../lib/reminderAdapter";

/**
 * ============================================================
 * BUSCAR LEMBRETES PARA UI
 * ============================================================
 *
 * Responsável por:
 * - Buscar dados do banco
 * - Garantir lembretes obrigatórios
 * - Converter para o modelo utilizado pela UI
 *
 * NÃO deve:
 * - aplicar regra de disparo
 */
export async function getReminders(
  userId: string,
): Promise<Reminder[]> {

  if (!supabase) {
    console.warn("Supabase não disponível");
    return [];
  }

  /**
   * TEMPORÁRIO
   *
   * Atualmente garantimos os lembretes
   * obrigatórios antes da leitura.
   *
   * Em uma evolução futura essa
   * responsabilidade deverá ser movida
   * para o bootstrap da aplicação.
   */
  await ensureFixedReminders(userId);

  const { data, error } = await supabase
    .from("scheduled_reminders")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error(
      "Erro ao buscar scheduled_reminders:",
      error,
    );

    return [];
  }

  return (
    data?.map(toUiReminder).filter(Boolean) as Reminder[]
  ) ?? [];
}

/**
 * ============================================================
 * BUSCAR LEMBRETES PARA TRIGGER (RAW DB)
 * ============================================================
 *
 * Responsável por:
 * - Retornar registros do banco
 * - Utilizado exclusivamente pelo
 *   engine de disparo.
 */
export async function getScheduledReminders(
  userId: string,
) {

  if (!supabase) {
    console.warn("Supabase não disponível");
    return [];
  }

  const { data, error } = await supabase
    .from("scheduled_reminders")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error(
      "Erro ao buscar scheduled_reminders:",
      error,
    );

    return [];
  }

  return data ?? [];
}

/**
 * ============================================================
 * ATUALIZAR STATUS DO LEMBRETE
 * ============================================================
 */
export async function updateReminderStatus(
  reminderId: string,
  action: "accepted" | "postponed",
): Promise<void> {

  if (!supabase) {
    console.warn("Supabase não disponível");
    return;
  }

  const { error } = await supabase
    .from("reminder_logs")
    .insert({
      reminder_id: reminderId,
      action,
    });

  if (error) {
    console.error(
      "Erro ao atualizar status:",
      error,
    );
  }
}

/**
 * ============================================================
 * RESETAR LOGS (QA)
 * ============================================================
 */
export async function resetReminderLogs(): Promise<void> {

  if (!supabase) {
    console.warn("Supabase não disponível");
    return;
  }

  const { error } = await supabase
    .from("reminder_logs")
    .delete()
    .neq("id", "");

  if (error) {
    console.error(
      "Erro ao resetar logs:",
      error,
    );
  }
}
