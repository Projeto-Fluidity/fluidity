import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ReminderConfigItem from "../components/reminders/ReminderConfigItem";
import ReminderConfigSummary from "../components/reminders/ReminderConfigSummary";

import { useAuth } from "../hooks/useAuth";

import {
  ensureFixedReminders,
} from "../services/scheduledReminderService";
import { supabase } from "../services/supabaseClient";

/**
 * Dias da semana utilizados pelo lembrete.
 */
const ALL_DAYS = [
  "seg",
  "ter",
  "qua",
  "qui",
  "sex",
  "sab",
  "dom",
];

/**
 * Representa um lembrete carregado do banco.
 */
type Reminder = {
  id: string;
  label: string;
  time: string;
  customDays: string[];
  active: boolean;
  category: "mood" | "hydration";
  isFixed: boolean;
};

/**
 * ============================================================
 * MOOD REMINDER CONFIG
 * ============================================================
 *
 * Tela responsável pela configuração do lembrete
 * diário de Humor.
 *
 * Nesta etapa será construída gradualmente.
 */
export default function MoodReminderConfig() {
  const navigate = useNavigate();

  const { user } = useAuth();

  /**
   * Armazena o lembrete fixo de humor.
   */
  const [reminder, setReminder] =
    useState<Reminder | null>(null);

    /**
 * ============================================================
 * CARREGA O LEMBRETE FIXO DE HUMOR
 * ============================================================
 *
 * Garante a existência dos lembretes obrigatórios
 * e carrega apenas o lembrete responsável pelo
 * registro diário de humor.
 */
  useEffect(() => {
    if (!user) {
      return;
    }

    const currentUser = user;

    async function loadReminder() {
      await ensureFixedReminders(currentUser.id);

      const { data, error } = await supabase
        .from("scheduled_reminders")
        .select("*")
        .eq("user_id", currentUser.id);
      if (error) {
        console.error("SUPABASE ERROR");
        console.error(error);
        console.error(JSON.stringify(error, null, 2));
        return;
      }

      const mapped: Reminder[] = (data ?? []).map((item) => ({
        id: item.id,
        label: item.label,
        time:
          item.time ??
          `${String(item.hour).padStart(2, "0")}:${String(
            item.minute
          ).padStart(2, "0")}`,
        customDays: item.days ?? ALL_DAYS,
        active: item.active ?? true,
        category: item.category,
        isFixed: item.is_fixed,
      }));

      const moodReminder = mapped.find(
        (item) =>
          item.category === "mood" &&
          item.isFixed
      );

      if (!moodReminder) {
        return;
      }

      setReminder(moodReminder);
    }

    loadReminder();
  }, [user]);

  return (
    <div className="min-h-full bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] p-4">

      {/* ======================================================
          HEADER
         ====================================================== */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>

        <h1 className="text-xl font-bold">
          Configurar Lembrete
        </h1>
      </div>

      <ReminderConfigSummary 
        title="Lembrete diário"
        description="Você pode alterar o horário e ativar ou desativar este lembrete." 
        
      />

      <div className="space-y-3 mt-4">
        {reminder && (
          <ReminderConfigItem
            label={reminder.label}
            time={reminder.time}
            customDays={reminder.customDays}
            active={reminder.active}
            canDelete={false}
            hideDays={true}
            onToggle={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        )}
      </div>

    </div>
  );
}
