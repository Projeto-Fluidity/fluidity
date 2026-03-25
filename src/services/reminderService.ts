import type { Reminder } from "../types/reminder";
import { supabase } from "./supabaseClient";
import { env } from "../config/env";
import {
  getMockReminders,
  setMockReminders,
} from "../mocks/reminderMock";

const USE_MOCK = env.useMock;

if (import.meta.env.DEV) {
  console.log("USE_MOCK (reminders):", USE_MOCK);
}

/**
 * Recupera a lista de lembretes do usuário.
 *
 * Os lembretes são retornados ordenados do mais recente
 * para o mais antigo com base no campo `created_at`.
 *
 * No modo mock, apenas lembretes com status "pending"
 * são retornados para manter consistência com a UI atual.
 *
 * @returns lista de lembretes
 */
export async function getReminders(): Promise<Reminder[]> {
  if (USE_MOCK) {
    console.log("[MOCK] Buscando lembretes");

    return getMockReminders().filter((r) => r.status === "pending");
  }

  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .order("created_at", { ascending: false });

  if (import.meta.env.DEV) {
    console.log("REMINDERS FROM DB:", data);
  }

  if (error) {
    console.error("Erro ao buscar lembretes:", error);
    return [];
  }

  return (data ?? []) as Reminder[];
}

/**
 * Atualiza o status de um lembrete existente.
 *
 * Permite alterar o estado do lembrete para:
 * - "accepted"
 * - "postponed"
 *
 * @param id identificador do lembrete
 * @param status novo status do lembrete
 * @throws Error caso ocorra falha na atualização
 */
export async function updateReminderStatus(
  id: string,
  status: Reminder["status"]
): Promise<void> {
  if (USE_MOCK) {
    console.log("[MOCK] Atualizando lembrete:", { id, status });

    const data = getMockReminders();

    const updated = data.map((r) =>
      r.id === id ? { ...r, status } : r
    );

    setMockReminders(updated);

    return;
  }

  const { error } = await supabase
    .from("reminders")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar lembrete:", error);
    throw new Error(
      error.message || "Não foi possível atualizar o lembrete"
    );
  }

  console.log("Lembrete atualizado:", { id, status });
}

 /**
  * Reseta os lembretes para "pending".
  *
  * Deve ser executado uma vez por dia para garantir
  * que os lembretes reapareçam para o usuário.
  */
export async function resetReminders(): Promise<void> {
  if (USE_MOCK) {
    console.log("[MOCK] Resetando lembretes");

    const data = getMockReminders();

    const reset: Reminder[] = data.map((r) => ({
      ...r,
      status: "pending",
    }));

    setMockReminders(reset);

    return;
  }
}
