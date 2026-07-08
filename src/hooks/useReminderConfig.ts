import { useCallback, useEffect, useState } from "react";

import {
  createReminder,
  deleteReminder,
  getScheduledReminders,
  toggleReminder,
  updateReminder,
} from "../services/reminderConfigService";

import { DEFAULT_REMINDER_LABEL } from "../constants/reminderDefaults";

import type {
  ReminderCategory,
  ScheduledReminder,
} from "../types/scheduledReminder";

/**
 * ============================================================
 * TYPES
 * ============================================================
 */

type UseReminderConfigParams = {
  userId?: string;
  category: ReminderCategory;
};

/**
 * ============================================================
 * USE REMINDER CONFIG
 * ============================================================
 */
export function useReminderConfig({
  userId,
  category,
}: UseReminderConfigParams) {
  /**
   * ============================================================
   * ESTADOS
   * ============================================================
   */

  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);

  const [editingReminder, setEditingReminder] =
    useState<ScheduledReminder | null>(null);

  const [editingTime, setEditingTime] = useState("");

  const [editingDays, setEditingDays] = useState<string[]>([]);

  const [isCreating, setIsCreating] = useState(false);

  const [deletingReminder, setDeletingReminder] =
    useState<ScheduledReminder | null>(null);

  /**
   * ============================================================
   * LEMBRETE SELECIONADO
   * ============================================================
   *
   * Exposição de uma visão derivada da coleção de lembretes.
   *
   * Utilizado por categorias que trabalham com um único
   * lembrete, como Humor.
   */
  const reminder = reminders[0] ?? null;

  /**
   * ============================================================
   * CARREGAMENTO
   * ============================================================
   */

  const loadReminders = useCallback(async () => {
    if (!userId) {
      return;
    }

    const data = await getScheduledReminders(userId, category);

    setReminders(data);
  }, [userId, category]);

  /**
   * ============================================================
   * LOAD INICIAL
   * ============================================================
   *
   * Carrega automaticamente os lembretes sempre que o
   * usuário ou a categoria forem alterados.
   */
  useEffect(() => {
    void loadReminders();
  }, [loadReminders]);

  /**
   * ============================================================
   * MODAL DE EDIÇÃO
   * ============================================================
   */

  const openEditModal = useCallback((reminder: ScheduledReminder) => {
    setIsCreating(false);
    setEditingReminder(reminder);
    setEditingTime(reminder.time);
    setEditingDays(reminder.days);
  }, []);

  const openCreateModal = useCallback(
    (time: string, days: readonly string[]) => {
      setIsCreating(true);
      setEditingReminder(null);
      setEditingTime(time);
      setEditingDays([...days]);
    },
    [],
  );

  const closeEditModal = useCallback(() => {
    setEditingReminder(null);
    setEditingTime("");
    setEditingDays([]);
    setIsCreating(false);
  }, []);

  /**
   * ============================================================
   * SALVAR LEMBRETE
   * ============================================================
   *
   * Cria ou atualiza um lembrete conforme
   * o modo atual do formulário.
   */
  const handleSaveReminder = useCallback(async () => {
    if (!userId) {
      return;
    }

    if (isCreating) {
      await createReminder(userId, {
        label: DEFAULT_REMINDER_LABEL[category],
        category,
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
  }, [
    userId,
    category,
    isCreating,
    editingReminder,
    editingTime,
    editingDays,
    loadReminders,
    closeEditModal,
  ]);

  /**
   * ============================================================
   * MODAL DE EXCLUSÃO
   * ============================================================
   */

  const openDeleteModal = useCallback((reminder: ScheduledReminder) => {
    setDeletingReminder(reminder);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeletingReminder(null);
  }, []);

  /**
   * ============================================================
   * EXCLUIR LEMBRETE
   * ============================================================
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!deletingReminder) {
      return;
    }

    await deleteReminder(deletingReminder.id);

    closeDeleteModal();

    await loadReminders();
  }, [deletingReminder, closeDeleteModal, loadReminders]);

  /**
   * ============================================================
   * ALTERAR STATUS
   * ============================================================
   *
   * Ativa ou desativa um lembrete e recarrega
   * a lista para manter a interface sincronizada.
   */
  const handleToggleReminder = useCallback(
    async (reminder: ScheduledReminder) => {
      await toggleReminder(reminder.id, !reminder.active);

      await loadReminders();
    },
    [loadReminders],
  );

  /**
 * ============================================================
 * CREATE TOGGLE REMINDER HANDLER
 * ============================================================
 *
 * Cria um callback já vinculado ao lembrete,
 * simplificando o consumo pelos componentes
 * de interface.
 */
const createToggleReminderHandler = useCallback(
  (reminder: ScheduledReminder) => {
    return () => handleToggleReminder(reminder);
  },
  [handleToggleReminder],
);

  /**
   * ============================================================
   * ALTERAR DIA
   * ============================================================
   */
  const handleToggleReminderDay = useCallback(
    async (reminder: ScheduledReminder, dayId: string) => {
      const updatedDays = reminder.days.includes(dayId)
        ? reminder.days.filter((day) => day !== dayId)
        : [...reminder.days, dayId];

      await updateReminder(reminder.id, {
        time: reminder.time,
        days: updatedDays,
      });

      await loadReminders();
    },
    [loadReminders],
  );

  /**
   * ============================================================
   * CREATE TOGGLE DAY HANDLER
   * ============================================================
   *
   * Cria um callback já vinculado ao lembrete,
   * simplificando o consumo pelos componentes
   * de interface.
   */
  const createToggleDayHandler = useCallback(
    (reminder: ScheduledReminder) => {
      return (dayId: string) => handleToggleReminderDay(reminder, dayId);
    },
    [handleToggleReminderDay],
  );

  return {
    reminders,
    reminder,

    editingReminder,
    editingTime,
    editingDays,

    isCreating,
    deletingReminder,

    setEditingTime,
    setEditingDays,

    loadReminders,

    openEditModal,
    openCreateModal,
    closeEditModal,

    openDeleteModal,
    closeDeleteModal,

    handleSaveReminder,

    handleConfirmDelete,
    handleToggleReminder,
    createToggleReminderHandler,

    handleToggleReminderDay,
    createToggleDayHandler,
  };
}
