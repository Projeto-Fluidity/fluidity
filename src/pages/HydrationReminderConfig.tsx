import { ChevronLeft, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import ReminderConfigSummary from "../components/reminders/ReminderConfigSummary";
import ReminderConfigItem from "../components/reminders/ReminderConfigItem";
import ReminderEditModal from "../components/reminders/ReminderEditModal";
import ReminderDeleteModal from "../components/reminders/ReminderDeleteModal";
import {
  createReminder,
  deleteReminder,
  getScheduledReminders,
  toggleReminder,
  updateReminder,
} from "../services/reminderConfigService";

import { useAuth } from "../hooks/useAuth";

import { DEFAULT_HYDRATION_DAYS, WEEK_DAYS } from "../constants/weekDays";

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

  /**
   * Lembretes carregados do banco de dados.
   */
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);

  /**
   * Lembrete atualmente em edição.
   */
  const [editingReminder, setEditingReminder] =
    useState<ScheduledReminder | null>(null);

  /**
   * Horário temporário utilizado pelo modal.
   */
  const [editingTime, setEditingTime] = useState("");

  /**
   * Dias temporários utilizados pelo modal.
   */
  const [editingDays, setEditingDays] = useState<string[]>([]);

  /**
   * Indica se o modal está sendo utilizado
   * para criação de um novo lembrete.
   */
  const [isCreating, setIsCreating] = useState(false);

  /**
   * Lembrete aguardando confirmação de exclusão.
   */
  const [deletingReminder, setDeletingReminder] =
    useState<ScheduledReminder | null>(null);

  /**
   * ============================================================
   * CARREGAMENTO
   * ============================================================
   *
   * Busca todos os lembretes de hidratação do
   * usuário autenticado.
   *
   * Esta função será reutilizada pelas próximas
   * implementações após:
   *
   * • criar;
   * • editar;
   * • excluir;
   * • ativar/desativar.
   */
  const loadReminders = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const data = await getScheduledReminders(user.id, "hydration");

      setReminders(data);
    } catch (error) {
      console.error("Erro ao carregar lembretes:", error);
    }
  }, [user]);

  /**
   * ============================================================
   * EDITAR LEMBRETE
   * ============================================================
   *
   * Prepara os dados para edição e abre o modal.
   */
  const handleEditReminder = useCallback((reminder: ScheduledReminder) => {
    setIsCreating(false);
    setEditingReminder(reminder);
    setEditingTime(reminder.time);
    setEditingDays(reminder.days);
  }, []);

  /**
   * ============================================================
   * DIAS DA SEMANA
   * ============================================================
   *
   * Alterna a seleção dos dias utilizados pelo
   * lembrete.
   */
  const handleDayToggle = useCallback((dayId: string) => {
    setEditingDays((current) =>
      current.includes(dayId)
        ? current.filter((day) => day !== dayId)
        : [...current, dayId],
    );
  }, []);

  /**
   * ============================================================
   * RESET DO MODAL
   * ============================================================
   *
   * Limpa todo o estado utilizado durante a
   * criação ou edição de lembretes.
   */
  const resetModalState = useCallback(() => {
    setEditingReminder(null);
    setEditingTime("");
    setEditingDays([]);
    setIsCreating(false);
  }, []);

  /**
   * ============================================================
   * RESET DO MODAL DE EXCLUSÃO
   * ============================================================
   *
   * Fecha o modal de confirmação de exclusão.
   */
  const resetDeleteModalState = useCallback(() => {
    setDeletingReminder(null);
  }, []);

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

      resetModalState();

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
    resetModalState,
  ]);

  /**
   * ============================================================
   * FECHAR MODAL
   * ============================================================
   */
  const handleCloseModal = useCallback(() => {
    resetModalState();
  }, [resetModalState]);

  /**
   * ============================================================
   * TOGGLE REMINDER
   * ============================================================
   *
   * Ativa ou desativa um lembrete.
   *
   * Após a atualização no banco os dados são
   * recarregados para manter a interface sempre
   * sincronizada.
   */
  const handleToggleReminder = useCallback(
    async (reminder: ScheduledReminder) => {
      try {
        await toggleReminder(reminder.id, !reminder.active);

        await loadReminders();
      } catch (error) {
        console.error("Erro ao atualizar lembrete:", error);
      }
    },
    [loadReminders],
  );

  /**
   * ============================================================
   * NOVO LEMBRETE
   * ============================================================
   *
   * Prepara o modal para criação de um novo
   * lembrete personalizado.
   */
  const handleCreateReminder = useCallback(() => {
    setIsCreating(true);

    setEditingReminder(null);

    setEditingTime("09:00");

    setEditingDays([...DEFAULT_HYDRATION_DAYS]);
  }, []);

  /**
   * ============================================================
   * EXCLUIR LEMBRETE
   * ============================================================
   *
   * Abre o modal de confirmação para exclusão
   * do lembrete selecionado.
   */
  const handleDeleteReminder = useCallback((reminder: ScheduledReminder) => {
    if (reminder.isFixed) {
      return;
    }

    setDeletingReminder(reminder);
  }, []);

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

      resetDeleteModalState();

      await loadReminders();
    } catch (error) {
      console.error("Erro ao excluir lembrete:", error);
    }
  }, [deletingReminder, loadReminders, resetDeleteModalState]);

  /**
   * ============================================================
   * FECHAR MODAL DE EXCLUSÃO
   * ============================================================
   *
   * Fecha o modal sem realizar a exclusão.
   */
  const handleCloseDeleteModal = useCallback(() => {
    resetDeleteModalState();
  }, [resetDeleteModalState]);

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
            active={reminder.active}
            canDelete={!reminder.isFixed}
            onToggle={() => handleToggleReminder(reminder)}
            onEdit={() => handleEditReminder(reminder)}
            onDelete={() => handleDeleteReminder(reminder)}
          />
        ))}
      </div>

      <button
        onClick={handleCreateReminder}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-white"
      >
        <Plus size={20} />
        Adicionar lembrete
      </button>

      <ReminderEditModal
        open={isCreating || editingReminder !== null}
        title={isCreating ? "Novo lembrete" : (editingReminder?.label ?? "")}
        time={editingTime}
        days={editingDays}
        weekDays={WEEK_DAYS}
        onTimeChange={setEditingTime}
        onDayToggle={handleDayToggle}
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
