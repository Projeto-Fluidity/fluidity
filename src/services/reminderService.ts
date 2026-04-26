import { supabase } from "./supabaseClient";
import { getDeviceId } from "../lib/deviceId";
import type { Reminder } from "../types/reminder";
import { ensureFixedReminder } from "./scheduledReminderService";

/**
 * ============================================================
 * BUSCAR LEMBRETES DISPONÍVEIS
 * ============================================================
 */
export async function getReminders(): Promise<Reminder[]> {
  console.log("🚀 getReminders CALLED");
console.log("SUPABASE:", supabase);
  if (!supabase) {
    console.warn("Supabase não disponível");
    return [];
  }

  const deviceId = getDeviceId();

  // garante 1 lembrete fixo
  await ensureFixedReminder();

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  console.log("DEVICE ID:", deviceId);
  console.log("NOW:", currentHour, currentMinute);

  /**
   * 1. Buscar horários configurados
   */
  const { data: scheduled, error } = await supabase
    .from("scheduled_reminders")
    .select("*")
    .eq("device_id", deviceId)
    .eq("enabled", true);

  if (error) {
    console.error("Erro ao buscar scheduled_reminders:", error);
    return [];
  }

  /**
   * 2. Buscar logs do dia (evitar repetição)
   */
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // const { data: logsToday } = await supabase
  //   .from("reminder_logs")
  //   .select("reminder_id")
  //   .eq("device_id", deviceId)
  //   .gte("created_at", startOfDay.toISOString());

  // const alreadyTriggeredIds = new Set(
  //   (logsToday ?? []).map((l) => l.reminder_id)
  // );

  // console.log("ALREADY TRIGGERED:", alreadyTriggeredIds);

  /**
   * 3. Filtrar por janela de tempo
   */
  const validReminders =
    scheduled?.filter((r) => {
      const nowMinutes = currentHour * 60 + currentMinute;
      const reminderMinutes = r.hour * 60 + r.minute;

      const isTimePassed = nowMinutes >= reminderMinutes;

      console.log("CHECKING:", {
        id: r.id,
        nowMinutes,
        reminderMinutes,
        isTimePassed,
      });

      return isTimePassed;
    }) ?? [];

  if (validReminders.length === 0) {
    console.log("Nenhum lembrete válido para este horário");
    return [];
  }

  /**
   * 4. Mapear para UI
   */
  return validReminders.map((r) => ({
    id: r.id,
    title: "Hora do check-in",
    description: "Como você está se sentindo agora?",
    time: `${String(r.hour).padStart(2, "0")}:${String(r.minute).padStart(2, "0")}`,
    variant: "info",
  }));
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
