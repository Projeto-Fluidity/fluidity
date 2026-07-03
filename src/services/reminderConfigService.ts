import { supabase } from "./supabaseClient";

/**
 * ============================================================
 * TYPES
 * ============================================================
 */

/**
 * Categorias que permitem criação
 * de lembretes personalizados.
 */
type ReminderCategory =
  | "hydration";

/**
 * Dados necessários para criação
 * de um lembrete personalizado.
 */
type CreateReminderData = {
  label: string;
  category: ReminderCategory;
  time: string;
  days: string[];
  active: boolean;
};

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
export async function createReminder(
  userId: string,
  data: CreateReminderData,
) {
  const { data: reminder, error } =
    await supabase
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
export async function deleteReminder(
  id: string,
) {
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
export async function toggleReminder(
  id: string,
  active: boolean,
) {
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
