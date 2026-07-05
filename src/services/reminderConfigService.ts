import { supabase } from "./supabaseClient";

import {
  toScheduledReminder,
  type DbScheduledReminder,
} from "../lib/scheduledReminderAdapter";

import type {
  ScheduledReminder,
  ReminderCategory,
} from "../types/scheduledReminder";

/**
 * ============================================================
 * TYPES
 * ============================================================
 */

/**
 * Categorias que permitem criação de
 * lembretes personalizados.
 *
 * Atualmente apenas hidratação permite
 * criação de novos lembretes.
 */
type CreateReminderCategory = Extract<ReminderCategory, "hydration">;

/**
 * Dados necessários para criação
 * de um lembrete personalizado.
 */
type CreateReminderData = {
  label: string;
  category: CreateReminderCategory;
  time: string;
  days: string[];
  active: boolean;
};

/**
 * ============================================================
 * GET SCHEDULED REMINDERS
 * ============================================================
 *
 * Busca os lembretes configurados pelo usuário.
 *
 * Responsabilidades:
 *
 * • consultar o banco de dados;
 * • filtrar por usuário;
 * • permitir filtro por categoria;
 * • converter o modelo do banco para
 *   o modelo utilizado pela aplicação.
 *
 * Nenhum detalhe da estrutura do banco
 * deve ser exposto para a interface.
 */
export async function getScheduledReminders(
  userId: string,
  category?: ReminderCategory,
): Promise<ScheduledReminder[]> {
  let query = supabase
    .from("scheduled_reminders")
    .select("*")
    .eq("user_id", userId)
    .order("time", {
      ascending: true,
    });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map((reminder) =>
    toScheduledReminder(reminder as DbScheduledReminder),
  );
}

/**
 * ============================================================
 * CREATE REMINDER
 * ============================================================
 *
 * Cria um novo lembrete personalizado.
 *
 * Os lembretes fixos são criados
 * exclusivamente pelo
 * scheduledReminderService.
 */
export async function createReminder(userId: string, data: CreateReminderData) {
  const { data: reminder, error } = await supabase
    .from("scheduled_reminders")
    .insert({
      user_id: userId,

      category: data.category,
      is_fixed: false,

      label: data.label,

      time: data.time,
      days: data.days,
      active: data.active,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return reminder;
}

/**
 * ============================================================
 * UPDATE REMINDER
 * ============================================================
 *
 * Atualiza horário e dias de um lembrete.
 */
export async function updateReminder(
  id: string,
  data: {
    time: string;
    days: string[];
  },
) {
  const { error } = await supabase
    .from("scheduled_reminders")
    .update({
      time: data.time,
      days: data.days,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

/**
 * ============================================================
 * DELETE REMINDER
 * ============================================================
 *
 * Remove um lembrete personalizado.
 *
 * A validação para impedir exclusão de
 * lembretes fixos pertence à camada de
 * negócio (UI/Service).
 */
export async function deleteReminder(id: string) {
  const { error } = await supabase
    .from("scheduled_reminders")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

/**
 * ============================================================
 * TOGGLE REMINDER
 * ============================================================
 *
 * Ativa ou desativa um lembrete.
 */
export async function toggleReminder(id: string, active: boolean) {
  const { error } = await supabase
    .from("scheduled_reminders")
    .update({
      active,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}
