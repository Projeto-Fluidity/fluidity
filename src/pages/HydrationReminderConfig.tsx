import { ChevronLeft, Plus } from "lucide-react";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import ReminderConfigSummary from "../components/reminders/ReminderConfigSummary";
import ReminderConfigItem from "../components/reminders/ReminderConfigItem";
import ReminderEditModal from "../components/reminders/ReminderEditModal";
import ReminderDeleteModal from "../components/reminders/ReminderDeleteModal";

import { useAuth } from "../hooks/useAuth";
import { useReminderConfig } from "../hooks/useReminderConfig";

import {
  DEFAULT_HYDRATION_DAYS,
  DEFAULT_HYDRATION_TIME,
} from "../constants/reminderDefaults";

import { reminderConfigMetadata } from "../data/reminderConfigMetadata";

/**
 * ============================================================
 * HYDRATION REMINDER CONFIG
 * ============================================================
 *
 * Tela responsável pela configuração dos
 * lembretes de hidratação.
 
 */
export default function HydrationReminderConfig() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const config = reminderConfigMetadata.hydration;

  /**
   * ============================================================
   * ESTADOS
   * ============================================================
   */

  const {
    reminders,

    editingReminder,
    editingTime,
    setEditingTime,

    isCreating,
    deletingReminder,

    loadReminders,

    openEditModal,
    openCreateModal,
    closeEditModal,

    openDeleteModal,
    closeDeleteModal,

    handleConfirmDelete,
    handleSaveReminder,

    createToggleDayHandler,
  } = useReminderConfig({
    userId: user?.id,
    category: "hydration",
  });

  /**
   * ============================================================
   * LOAD INICIAL
   * ============================================================
   *
   * Sempre que houver um usuário autenticado,
   * os lembretes são carregados.
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

        <h1 className="text-xl font-bold">Configurar Lembretes</h1>
      </div>

      {/* ======================================================
          RESUMO
         ====================================================== */}
      <ReminderConfigSummary
        title={config.summaryTitle}
        description={config.summaryDescription}
      />

      {/* ======================================================
          LISTA DE LEMBRETES
         ======================================================

         Os lembretes são carregados
         dinamicamente do banco de dados.
      */}
      <div className="mt-4 space-y-3">
        {reminders.map((reminder) => (
          <ReminderConfigItem
            key={reminder.id}
            label={reminder.label}
            time={reminder.time}
            customDays={reminder.days}
            canDelete={config.allowDelete}
            onEdit={() => openEditModal(reminder)}
            onToggleDay={createToggleDayHandler(reminder)}
            onDelete={() => openDeleteModal(reminder)}
          />
        ))}
      </div>

      <button
        onClick={() =>
          openCreateModal(DEFAULT_HYDRATION_TIME, DEFAULT_HYDRATION_DAYS)
        }
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-white"
      >
        <Plus size={20} />
        Adicionar lembrete
      </button>

      <ReminderEditModal
        open={isCreating || editingReminder !== null}
        title={isCreating ? "Novo lembrete" : (editingReminder?.label ?? "")}
        time={editingTime}
        onTimeChange={setEditingTime}
        onSave={handleSaveReminder}
        onClose={closeEditModal}
      />

      <ReminderDeleteModal
        open={deletingReminder !== null}
        title={deletingReminder?.label ?? ""}
        onConfirm={handleConfirmDelete}
        onClose={closeDeleteModal}
      />
    </div>
  );
}
