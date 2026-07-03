import { supabase } from "./supabaseClient";

/**
 * ============================================================
 * TYPES
 * ============================================================
 */

/**
 * Categorias de lembretes obrigatórios da aplicação.
 */
type FixedReminderCategory =
  | "mood"
  | "hydration";

/**
 * Dados necessários para criação
 * de um lembrete fixo.
 */
type FixedReminder = {
  userId: string;
  category: FixedReminderCategory;
  label: string;
  time: string;
};

/**
 * ============================================================
 * CREATE FIXED REMINDER
 * ============================================================
 *
 * Cria um lembrete obrigatório da aplicação.
 *
 * Esta função é utilizada exclusivamente
 * pelo ensureFixedReminders().
 */
async function createFixedReminder({
  userId,
  category,
  label,
  time,
}: FixedReminder) {
  const { error } = await supabase
    .from("scheduled_reminders")
    .insert({
      user_id: userId,
      category,
      is_fixed: true,
      label,
      time,
      active: true,
    });

  if (error) {
    throw error;
  }
}

/**
 * ============================================================
 * ENSURE FIXED REMINDERS
 * ============================================================
 *
 * Garante que o usuário possua todos os
 * lembretes obrigatórios do sistema.
 *
 * Regras:
 *
 * • Humor
 *   - sempre existe um único lembrete
 *
 * • Hidratação
 *   - sempre existe ao menos um lembrete
 *
 * Caso algum lembrete obrigatório não exista,
 * ele será criado automaticamente.
 */
export async function ensureFixedReminders(
  userId: string,
): Promise<void> {

  /**
   * ============================================================
   * CARREGA LEMBRETES FIXOS
   * ============================================================
   */
  const { data, error } = await supabase
    .from("scheduled_reminders")
    .select("category")
    .eq("user_id", userId)
    .eq("is_fixed", true);

  if (error) {
    console.error(error);
    return;
  }

  /**
   * Categorias já existentes.
   */
  const categories = new Set(
    (data ?? []).map(
      (item) => item.category,
    ),
  );

  /**
   * ============================================================
   * HUMOR
   * ============================================================
   */
  if (!categories.has("mood")) {
    await createFixedReminder({
      userId,
      category: "mood",
      label: "Registro diário",
      time: "08:00",
    });
  }

  /**
   * ============================================================
   * HIDRATAÇÃO
   * ============================================================
   */
  if (!categories.has("hydration")) {
    await createFixedReminder({
      userId,
      category: "hydration",
      label: "Hora de se hidratar",
      time: "09:00",
    });
  }
}
