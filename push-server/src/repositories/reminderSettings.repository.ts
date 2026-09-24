import { supabase } from "../lib/supabase.js";

export type ReminderSettings = {
  user_id: string;
  device_id: string | null;
  enabled: boolean;
  start_hour: number;
  end_hour: number;
  frequency_minutes: number;
  max_per_day: number;
};

export async function getReminderSettings(
  userId: string,
): Promise<ReminderSettings | null> {
  const { data, error } = await supabase
    .from("reminder_settings")
    .select(
      "user_id, device_id, enabled, start_hour, end_hour, frequency_minutes, max_per_day",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Erro ao buscar configurações de lembretes: ${error.message}`,
    );
  }

  return data;
}

export async function createDefaultReminderSettings(
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("reminder_settings")
    .insert({
      user_id: userId,
      enabled: true,
      start_hour: 8,
      end_hour: 18,
      frequency_minutes: 60,
      max_per_day: 10,
    });

  if (!error) {
    return;
  }

  if (error.code === "23505") {
    return;
  }

  throw new Error(
    `Erro ao criar configurações padrão de lembretes: ${error.message}`,
  );
}
