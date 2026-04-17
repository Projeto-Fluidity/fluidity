import { useEffect, useState } from "react";
import type { Reminder } from "../types/reminder";
import {
  getReminders,
  updateReminderStatus,
} from "../services/reminderService";

/**
 * Hook responsável por gerenciar os lembretes da aplicação.
 *
 * Responsabilidades:
 * - Buscar lembretes disponíveis no dia
 * - Registrar interação do usuário (histórico)
 * - Atualizar UI (remover item após ação)
 * - Exibir feedback (toast)
 * - Permitir recarregar dados (QA / debug)
 *
 * Arquitetura:
 * - Service → dados (backend/mock)
 * - Hook → estado (React)
 * - UI → renderização
 */
export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  /**
   * Carrega os lembretes do dia
   */
  async function loadReminders() {
    try {
      const data = await getReminders();
      setReminders(data);
    } catch (error) {
      console.error("Erro ao carregar lembretes:", error);
    }
  }

  /**
   * Recarrega manualmente (QA / debug)
   */
  async function reloadReminders() {
    await loadReminders();
  }

  /**
   * Aceitar lembrete
   */
  async function acceptReminder(id: string) {
    try {
      await updateReminderStatus(id, "accepted");

      setReminders((prev) => prev.filter((r) => r.id !== id));
      setFeedback("Lembrete aceito");
    } catch (error) {
      console.error(error);
      setFeedback("Erro ao atualizar lembrete");
    }
  }

  /**
   * Adiar lembrete
   */
  async function postponeReminder(id: string) {
    try {
      await updateReminderStatus(id, "postponed");

      setReminders((prev) => prev.filter((r) => r.id !== id));
      setFeedback("Lembrete adiado");
    } catch (error) {
      console.error(error);
      setFeedback("Erro ao atualizar lembrete");
    }
  }

  /**
   * Load inicial
   */
  useEffect(() => {
    async function init() {
      await loadReminders();
    }

    init();
  }, []);

  /**
   * Controle do toast
   */
  useEffect(() => {
    if (!feedback) return;

    const timer = setTimeout(() => {
      setFeedback(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [feedback]);

  return {
    reminders,
    feedback,
    acceptReminder,
    postponeReminder,
    reloadReminders,
  };
}
