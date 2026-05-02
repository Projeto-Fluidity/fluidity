import { supabase } from "./supabaseClient";
import { getDeviceId } from "../lib/deviceId";
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
 * - Converter para UI
 *
 * NÃO deve:
 * - aplicar regra de disparo
 */
export async function getReminders(): Promise<Reminder[]> {
  console.log("getReminders CALLED");

  if (!supabase) {
    console.warn("Supabase não disponível");
    return [];
  }

  const deviceId = getDeviceId();

  /**
   * TEMPORÁRIO (legado)
   * Ideal: mover para bootstrap (App.tsx)
   */
  await ensureFixedReminders();

  const { data, error } = await supabase
    .from("scheduled_reminders")
    .select("*")
    .eq("device_id", deviceId);

  if (error) {
    console.error("Erro ao buscar scheduled_reminders:", error);
    return [];
  }

  const uiReminders =
    data?.map(toUiReminder).filter(Boolean) ?? [];

  return uiReminders as Reminder[];
}

/**
 * ============================================================
 * BUSCAR LEMBRETES PARA TRIGGER (RAW DB)
 * ============================================================
 *
 * Responsável por:
 * - Retornar modelo do banco (DbReminder)
 * - Usado pelo engine de disparo
 */
export async function getScheduledReminders() {
  if (!supabase) {
    console.warn("Supabase não disponível");
    return [];
  }

  const deviceId = getDeviceId();

  const { data, error } = await supabase
    .from("scheduled_reminders")
    .select("*")
    .eq("device_id", deviceId);

  if (error) {
    console.error("Erro ao buscar scheduled_reminders:", error);
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
  action: "accepted" | "postponed"
): Promise<void> {
  if (!supabase) {
    console.warn("Supabase não disponível");
    return;
  }

  const deviceId = getDeviceId();

  const { error } = await supabase.from("reminder_logs").insert({
    reminder_id: reminderId,
    action,
    device_id: deviceId,
  });

  if (error) {
    console.error("Erro ao atualizar status:", error);
  } else {
    console.log("Status registrado:", { reminderId, action });
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

  const deviceId = getDeviceId();

  const { error } = await supabase
    .from("reminder_logs")
    .delete()
    .eq("device_id", deviceId);

  if (error) {
    console.error("Erro ao resetar logs:", error);
  } else {
    console.log("Logs resetados com sucesso");
  }
}
