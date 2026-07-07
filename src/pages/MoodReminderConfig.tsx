import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ReminderConfigItem from "../components/reminders/ReminderConfigItem";
import ReminderConfigSummary from "../components/reminders/ReminderConfigSummary";

import { useAuth } from "../hooks/useAuth";
import { useReminderConfig } from "../hooks/useReminderConfig";

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
  const { reminder, loadReminders } = useReminderConfig({
    userId: user?.id,
    category: "mood",
  });

  /**
   * ============================================================
   * CARREGAMENTO VIA HOOK
   * ============================================================
   *
   * Inicia o carregamento utilizando a nova infraestrutura
   * compartilhada de configuração de lembretes.
   *
   * Nesta etapa o carregamento legado permanece ativo
   * para permitir validação incremental da refatoração.
   */
  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  return (
    <div className="min-h-full bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] p-4">
      {/* ======================================================
          HEADER
         ====================================================== */}
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>

        <h1 className="text-xl font-bold">Configurar Lembrete</h1>
      </div>

      <ReminderConfigSummary
        title="Lembrete diário"
        description="Você pode alterar o horário e ativar ou desativar este lembrete."
      />

      <div className="mt-4 space-y-3">
        {reminder && (
          <ReminderConfigItem
            label={reminder.label}
            time={reminder.time}
            customDays={reminder.days}
            canDelete={false}
            hideDays={true}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        )}
      </div>
    </div>
  );
}
