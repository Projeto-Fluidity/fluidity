import { supabase } from "./supabaseClient";
import { getDeviceId } from "../lib/deviceId";
import type { Reminder } from "../types/reminder";
import { ensureFixedReminders } from "./scheduledReminderService";

// 🔥 NOVO: adapter
import {
  toUiReminder,
  shouldTriggerReminder,
} from "../lib/reminderAdapter";

/**
 * ============================================================
 * BUSCAR LEMBRETES DISPONÍVEIS
 * ============================================================
 *
 * Responsável por:
 * - Buscar dados do banco
 * - Aplicar regra de disparo (adapter)
 * - Converter para UI
 *
 * NÃO deve:
 * - conter regra duplicada
 * - conhecer estrutura antiga/novo diretamente
 */
export async function getReminders(): Promise<Reminder[]> {
  console.log("🚀 getReminders CALLED");

  if (!supabase) {
    console.warn("Supabase não disponível");
    return [];
  }

  const deviceId = getDeviceId();

  /**
   * ⚠️ TEMPORÁRIO (legado)
   * Ideal: mover para bootstrap (App.tsx)
   */
  await ensureFixedReminders();

  /**
   * ============================================================
   * 1. Buscar lembretes ativos (compatível)
   * ============================================================
   */
  const { data: scheduled, error } = await supabase
    .from("scheduled_reminders")
    .select("*")
    .eq("device_id", deviceId);

  if (error) {
    console.error("Erro ao buscar scheduled_reminders:", error);
    return [];
  }

  /**
   * ============================================================
   * 2. Buscar logs do dia (evitar repetição)
   * ============================================================
   */
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { data: logsToday } = await supabase
    .from("reminder_logs")
    .select("reminder_id")
    .eq("device_id", deviceId)
    .gte("created_at", startOfDay.toISOString());

  const alreadyTriggeredIds = new Set(
    (logsToday ?? []).map((l) => l.reminder_id)
  );

  /**
   * ============================================================
   * 3. Aplicar regra de disparo (adapter)
   * ============================================================
   */
  const now = new Date();

  const validReminders =
    scheduled?.filter((r) =>
      shouldTriggerReminder(
        r,
        now,
        alreadyTriggeredIds.has(r.id)
      )
    ) ?? [];

  if (validReminders.length === 0) {
    console.log("Nenhum lembrete válido para este horário");
    return [];
  }

  /**
   * ============================================================
   * 4. Converter para UI (adapter)
   * ============================================================
   */
  const uiReminders = validReminders
    .map(toUiReminder)
    .filter(Boolean) as Reminder[];

  return uiReminders;
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
