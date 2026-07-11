import { 
  useCallback,
  useEffect, 
  useState,
} from "react";
import type { Reminder } from "../types/reminder";
import {
  getReminders,
  updateReminderStatus,
} from "../services/reminderService";
import { useAuth } from "./useAuth";

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

  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [feedback, setFeedback] = 
  useState<string | null>(null);

  /**
   * Carrega os lembretes do usuário.
   */
  const userId = user?.id;

  const loadReminders = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      const data = await getReminders(userId);
      setReminders(data);
    } catch (error) {
      console.error("Erro ao carregar lembretes:", error);
    }
  }, [userId]);

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
    loadReminders();
  }, [loadReminders]);

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
