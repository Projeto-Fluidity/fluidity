import { ChevronLeft, Plus } from "lucide-react";
import { useCallback, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import ReminderConfigSummary from "../components/reminders/ReminderConfigSummary";
import ReminderConfigItem from "../components/reminders/ReminderConfigItem";
import ReminderEditModal from "../components/reminders/ReminderEditModal";
import ReminderDeleteModal from "../components/reminders/ReminderDeleteModal";
import {
  createReminder,
  deleteReminder,
  updateReminder,
} from "../services/reminderConfigService";

import { useAuth } from "../hooks/useAuth";
import { useReminderConfig } from "../hooks/useReminderConfig";

import {
  DEFAULT_HYDRATION_DAYS,
  DEFAULT_HYDRATION_TIME,
} from "../constants/reminderDefaults";
import type { ScheduledReminder } from "../types/scheduledReminder";

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

    editingDays,

    isCreating,
    deletingReminder,

    loadReminders,

    openEditModal,
    openCreateModal,
    closeEditModal,

    openDeleteModal,
    closeDeleteModal,
  } = useReminderConfig({
    userId: user?.id,
    category: "hydration",
  });

  /**
   * ============================================================
   * SALVAR ALTERAÇÕES
   * ============================================================
   *
   * Persiste as alterações realizadas pelo
   * usuário e atualiza a lista.
   */
  const handleSaveReminder = useCallback(async () => {
    try {
      if (isCreating) {
        if (!user) {
          return;
        }

        await createReminder(user.id, {
          label: "Hora de se hidratar",
          category: "hydration",
          time: editingTime,
          days: editingDays,
          active: true,
        });
      } else {
        if (!editingReminder) {
          return;
        }

        await updateReminder(editingReminder.id, {
          time: editingTime,
          days: editingDays,
        });
      }

      closeEditModal();

      await loadReminders();
    } catch (error) {
      console.error("Erro ao atualizar lembrete:", error);
    }
  }, [
    editingReminder,
    editingTime,
    editingDays,
    isCreating,
    user,
    loadReminders,
    closeEditModal,
  ]);

  /**
   * ============================================================
   * FECHAR MODAL
   * ============================================================
   */
  const handleCloseModal = useCallback(() => {
    closeEditModal();
  }, [closeEditModal]);

  /**
   * ============================================================
   * ALTERAR DIA DA SEMANA
   * ============================================================
   *
   * Atualiza imediatamente os dias de um
   * lembrete sem necessidade de abrir o modal.
   */
  const handleToggleReminderDay = useCallback(
    async (
      reminder: ScheduledReminder,
      dayId: string,
    ) => {
      const updatedDays = reminder.days.includes(dayId)
        ? reminder.days.filter((day) => day !== dayId)
        : [...reminder.days, dayId];

      try {
        await updateReminder(reminder.id, {
          time: reminder.time,
          days: updatedDays,
        });

        await loadReminders();
      } catch (error) {
        console.error(
          "Erro ao atualizar dias do lembrete:",
          error,
        );
      }
    },
    [loadReminders],
  );

  /**
   * ============================================================
   * CONFIRMAR EXCLUSÃO
   * ============================================================
   *
   * Remove o lembrete do banco de dados e
   * atualiza a lista da tela.
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!deletingReminder) {
      return;
    }

    try {
      await deleteReminder(deletingReminder.id);

      closeDeleteModal();

      await loadReminders();
    } catch (error) {
      console.error("Erro ao excluir lembrete:", error);
    }
  }, [
    deletingReminder,
    loadReminders,
    closeDeleteModal,
  ]);

  /**
   * ============================================================
   * FECHAR MODAL DE EXCLUSÃO
   * ============================================================
   */
  const handleCloseDeleteModal = useCallback(() => {
    closeDeleteModal();
  }, [closeDeleteModal]);

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
        title="Lembretes de hidratação"
        description="Adicione lembretes ao longo do dia para manter uma boa hidratação."
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
          canDelete
          onEdit={() => openEditModal(reminder)}
          onToggleDay={(dayId) =>
            handleToggleReminderDay(reminder, dayId)
          }
          onDelete={() => openDeleteModal(reminder)}
        />
        ))}
      </div>

      <button
        onClick={() =>
          openCreateModal(
            DEFAULT_HYDRATION_TIME,
            DEFAULT_HYDRATION_DAYS,
          )
        }
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-white"
      >
        <Plus size={20} />
        Adicionar lembrete
      </button>

      <ReminderEditModal
        open={isCreating || editingReminder !== null}
        title={
          isCreating
            ? "Novo lembrete"
            : (editingReminder?.label ?? "")
        }
        time={editingTime}
        onTimeChange={setEditingTime}
        onSave={handleSaveReminder}
        onClose={handleCloseModal}
      />

      <ReminderDeleteModal
        open={deletingReminder !== null}
        title={deletingReminder?.label ?? ""}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDeleteModal}
      />
    </div>
  );
}
