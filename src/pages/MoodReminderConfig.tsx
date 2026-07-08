import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ReminderConfigItem from "../components/reminders/ReminderConfigItem";
import ReminderConfigSummary from "../components/reminders/ReminderConfigSummary";
import ReminderEditModal from "../components/reminders/ReminderEditModal";
import ReminderActivationSection from "../components/reminders/ReminderActivationSection";

import { reminderConfigMetadata } from "../data/reminderConfigMetadata";

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
  const config = reminderConfigMetadata.mood;

  const {
    reminder,

    editingReminder,
    editingTime,

    setEditingTime,
    openEditModal,
    closeEditModal,

    handleSaveReminder,

    createToggleReminderHandler,
  } = useReminderConfig({
    userId: user?.id,
    category: "mood",
  });

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
        title={config.summaryTitle}
        description={config.summaryDescription}
      />

      <div className="mt-4 space-y-3">
        {reminder && (
          <ReminderConfigItem
            label={reminder.label}
            time={reminder.time}
            customDays={reminder.days}
            canDelete={config.allowDelete}
            hideDays={!config.allowEditDays}
            onEdit={() => openEditModal(reminder)}
            onDelete={() => {}}
          />
        )}
      </div>

      {reminder && (
        <ReminderActivationSection
          title="Lembrete ativo"
          description="Receba diariamente um lembrete para registrar seu humor."
          active={reminder.active}
          onToggle={createToggleReminderHandler(reminder)}
        />
      )}

      <ReminderEditModal
        open={editingReminder !== null}
        title={reminder?.label ?? ""}
        time={editingTime}
        onTimeChange={setEditingTime}
        onSave={handleSaveReminder}
        onClose={closeEditModal}
      />
    </div>
  );
}
