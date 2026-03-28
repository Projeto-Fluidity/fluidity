import type { Reminder } from "../types/reminder";
import { supabase } from "./supabaseClient";

/**
 * ============================================================
 * 🧠 CONCEITO GERAL
 * ============================================================
 *
 * Este service trabalha com DUAS fontes de dados:
 *
 * 1. reminders → dados fixos (templates)
 * 2. reminder_logs → histórico de interação do usuário
 *
 * Regra principal:
 * 👉 Um lembrete NÃO deve aparecer se já foi utilizado HOJE
 *
 * Ou seja:
 * - Se NÃO tem log hoje → aparece
 * - Se tem log hoje → NÃO aparece
 *
 * Isso elimina a necessidade de controlar "status" no reminder.
 */

/**
 * Retorna a data atual no formato YYYY-MM-DD
 *
 * Exemplo: "2026-03-28"
 */
function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * ============================================================
 * 📥 BUSCAR LEMBRETES DISPONÍVEIS
 * ============================================================
 *
 * Fluxo:
 * 1. Busca todos os lembretes (reminders)
 * 2. Busca logs de interação
 * 3. Filtra apenas os lembretes NÃO utilizados hoje
 */
export async function getReminders(): Promise<Reminder[]> {
  const today = getToday();

  /**
   * 1. Buscar todos os lembretes (templates)
   */
  const { data: reminders, error: remindersError } = await supabase
    .from("reminders")
    .select("*");

  if (remindersError) {
    console.error("Erro ao buscar reminders:", remindersError);
    return [];
  }

  /**
   * 2. Buscar logs de interação
   */
  const { data: logs, error: logsError } = await supabase
    .from("reminder_logs")
    .select("reminder_id, created_at");

  if (logsError) {
    console.error("Erro ao buscar logs:", logsError);
    return reminders ?? [];
  }

  /**
   * 3. Identificar quais lembretes já foram usados HOJE
   */
  const usedToday = new Set(
    (logs ?? [])
      .filter((log) => log.created_at.startsWith(today))
      .map((log) => log.reminder_id)
  );

  /**
   * 4. Retornar apenas lembretes que NÃO foram usados hoje
   */
  return (reminders ?? []).filter(
    (reminder) => !usedToday.has(reminder.id)
  );
}

/**
 * ============================================================
 * 📝 CRIAR LOG DE INTERAÇÃO
 * ============================================================
 *
 * Cada ação do usuário gera um registro na tabela reminder_logs.
 *
 * Exemplos:
 * - accepted
 * - postponed
 */
export async function createReminderLog(
  reminderId: string,
  action: "accepted" | "postponed"
): Promise<void> {
  const { error } = await supabase
    .from("reminder_logs")
    .insert({
      reminder_id: reminderId,
      action,
    });

  if (error) {
    console.error("Erro ao criar log:", error);
    throw new Error("Erro ao salvar interação do usuário");
  }
}

/**
 * ============================================================
 * 🔄 ATUALIZAR STATUS (AGORA = CRIAR LOG)
 * ============================================================
 *
 * Antes:
 * - Atualizava o reminder (status)
 *
 * Agora:
 * - Apenas registra a ação no histórico
 *
 * Isso garante:
 * ✔ Histórico completo
 * ✔ Reaparecimento automático no dia seguinte
 */
export async function updateReminderStatus(
  id: string,
  status: Reminder["status"]
): Promise<void> {
  await createReminderLog(id, status);
}
