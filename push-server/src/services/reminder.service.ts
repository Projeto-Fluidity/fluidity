import { supabase } from "../lib/supabase.js";

export type ScheduledReminder = {
  id: string;
  user_id: string;
  category: "mood" | "hydration";
  label: string | null;
  time: string | null;
  days: string[] | null;
  active: boolean | null;
  is_fixed: boolean | null;
};

export async function getActiveReminders(): Promise<
  ScheduledReminder[]
> {
  const { data, error } = await supabase
    .from("scheduled_reminders")
    .select(
      "id, user_id, category, label, time, days, active, is_fixed",
    )
    .eq("active", true);

  if (error) {
    throw new Error(
      `Erro ao buscar lembretes agendados: ${error.message}`,
    );
  }

  return data ?? [];
}
