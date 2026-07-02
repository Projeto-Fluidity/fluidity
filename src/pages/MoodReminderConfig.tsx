import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReminderConfigSummary from "../components/reminders/ReminderConfigSummary";
import ReminderConfigItem from "../components/reminders/ReminderConfigItem";

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
        <ReminderConfigItem
          label="Registro diário"
          time="08:00"
          customDays={[
            "seg",
            "ter",
            "qua",
            "qui",
            "sex",
            "sab",
            "dom",
          ]}
          active={true}
          canDelete={false}
          hideDays={true}
          onToggle={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </div>

    </div>
  );
}
