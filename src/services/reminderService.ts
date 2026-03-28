/**
 * ============================================================
 * REMINDER SERVICE
 * ============================================================
 *
 * Responsável por:
 * - Buscar lembretes disponíveis no dia
 * - Registrar interações do usuário (histórico)
 *
 * Arquitetura:
 * - reminders → dados estáticos (templates)
 * - reminder_logs → histórico de uso
 *
 * Regra de negócio:
 * - Um lembrete só pode aparecer 1x por dia
 * - Após interação → não aparece novamente no mesmo dia
 * - No dia seguinte → volta automaticamente
 */

import type { Reminder } from "../types/reminder";
import { supabase } from "./supabaseClient";
import { env } from "../config/env";
import { getMockReminders } from "../mocks/reminderMock";
import {
  getMockLogs,
  addMockLog,
} from "../mocks/reminderLogMock";

const USE_MOCK = env.useMock;

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
 *
 * Fluxo:
 * 1. Buscar todos os reminders
 * 2. Buscar logs de interação
 * 3. Filtrar lembretes já utilizados hoje
 */
export async function getReminders(): Promise<Reminder[]> {
  const today = getToday();

  /**
   * ========================
   * MODO MOCK
   * ========================
   */
  if (USE_MOCK) {
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
   * PRODUÇÃO (SUPABASE)
   * ========================
   */

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

/**
 * ============================================================
 * REGISTRAR INTERAÇÃO DO USUÁRIO
 * ============================================================
 *
 * Cria um registro na tabela reminder_logs.
 *
 * Cada interação gera um evento:
 * - accepted
 * - postponed
 */
export async function updateReminderStatus(
  id: string,
  action: "accepted" | "postponed"
): Promise<void> {
  /**
   * ========================
   * MODO MOCK
   * ========================
   */
  if (USE_MOCK) {
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
   * PRODUÇÃO (SUPABASE)
   * ========================
   */
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
}
