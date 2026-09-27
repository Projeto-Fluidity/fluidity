import { supabase } from "../lib/supabase.js";

export async function hasFixedMoodReminder(
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("scheduled_reminders")
    .select("id")
    .eq("user_id", userId)
    .eq("category", "mood")
    .eq("is_fixed", true)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Erro ao verificar lembrete fixo de humor: ${error.message}`,
    );
  }

  return data !== null;
}

export async function createFixedMoodReminder(
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("scheduled_reminders")
    .insert({
      user_id: userId,
      category: "mood",
      is_fixed: true,
      label: "Registro diário",
      time: "08:00",
      active: true,
    });

  if (!error) {
    return;
  }

  if (error.code === "23505") {
    return;
  }

  throw new Error(
    `Erro ao criar lembrete fixo de humor: ${error.message}`,
  );
}
