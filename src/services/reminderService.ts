/**
 * ============================================================
 * REMINDER SERVICE
 * ============================================================
 */

import type { Reminder } from "../types/reminder";
import { supabase } from "./supabaseClient";
import { env } from "../config/env";
import { getMockReminders } from "../mocks/reminderMock";
import {
  getMockLogs,
  addMockLog,
} from "../mocks/reminderLogMock";

/**
 * Retorna a data atual no formato YYYY-MM-DD
 */
function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * ============================================================
 * BUSCAR LEMBRETES DISPONÍVEIS
 * ============================================================
 */
export async function getReminders(): Promise<Reminder[]> {
  const source = env.dataMode ?? (env.useMock ? "storage" : "api");
  const today = getToday();

  /**
   * ========================
   * SEED / STORAGE (mock)
   * ========================
   */
  if (source === "seed" || source === "storage") {
    const reminders = getMockReminders();
    const logs = getMockLogs();

    const usedToday = new Set(
      logs
        .filter((l) => l.created_at.startsWith(today))
        .map((l) => l.reminder_id)
    );

    return reminders.filter((r) => !usedToday.has(r.id));
  }

  /**
   * ========================
   * API (Supabase)
   * ========================
   */
  if (source === "api") {
    if (!supabase) {
      console.warn("Supabase não disponível neste ambiente");
      return [];
    }

    const { data: reminders, error: remindersError } = await supabase
      .from("reminders")
      .select("*");

    if (remindersError) {
      console.error("Erro ao buscar reminders:", remindersError);
      return [];
    }

    const { data: logs, error: logsError } = await supabase
      .from("reminder_logs")
      .select("reminder_id, created_at");

    if (logsError) {
      console.error("Erro ao buscar logs:", logsError);
      return reminders ?? [];
    }

    const usedToday = new Set(
      (logs ?? [])
        .filter((log) => log.created_at.startsWith(today))
        .map((log) => log.reminder_id)
    );

    return (reminders ?? []).filter(
      (reminder) => !usedToday.has(reminder.id)
    );
  }

  return [];
}

/**
 * ============================================================
 * REGISTRAR INTERAÇÃO DO USUÁRIO
 * ============================================================
 */
export async function updateReminderStatus(
  id: string,
  action: "accepted" | "postponed"
): Promise<void> {
  const source = env.dataMode ?? (env.useMock ? "storage" : "api");

  /**
   * ========================
   * SEED / STORAGE (mock)
   * ========================
   */
  if (source === "seed" || source === "storage") {
    addMockLog({
      id: crypto.randomUUID(),
      reminder_id: id,
      action,
      created_at: new Date().toISOString(),
    });

    return;
  }

  /**
   * ========================
   * API (Supabase)
   * ========================
   */
  if (source === "api") {
    if (!supabase) {
      throw new Error("Supabase não disponível neste ambiente");
    }

    const { error } = await supabase
      .from("reminder_logs")
      .insert({
        reminder_id: id,
        action,
      });

    if (error) {
      console.error("Erro ao salvar log:", error);
      throw new Error("Erro ao registrar interação");
    }

    return;
  }
}

/**
 * ============================================================
 * RESET DE LOGS (QA)
 * ============================================================
 */
export async function resetReminderLogs(): Promise<void> {
  const source = env.dataMode ?? (env.useMock ? "storage" : "api");

  /**
   * ========================
   * SEED / STORAGE (mock)
   * ========================
   */
  if (source === "seed" || source === "storage") {
    const { resetMockLogs } = await import("../mocks/reminderLogMock");
    resetMockLogs();
    console.log("[QA] Logs resetados (mock)");
    return;
  }

  /**
   * ========================
   * API (desabilitado por segurança)
   * ========================
   */
  if (source === "api") {
    console.warn("Reset de logs desabilitado em ambiente API");
    return;
  }
}
