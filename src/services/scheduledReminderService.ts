import { supabase } from "./supabaseClient";

/**
 * ============================================================
 * TYPES
 * ============================================================
 */

/**
 * Categorias de lembretes obrigatórios.
 *
 * Atualmente apenas o lembrete de humor é
 * obrigatório para a aplicação.
 */
type FixedReminderCategory = "mood";

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
 * Garante a existência apenas dos lembretes
 * obrigatórios da aplicação.
 *
 * Atualmente existe somente um lembrete
 * obrigatório:
 *
 * • Registro diário de humor.
 *
 * Os lembretes de hidratação são totalmente
 * gerenciados pelo usuário e não são mais
 * recriados automaticamente.
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
}
