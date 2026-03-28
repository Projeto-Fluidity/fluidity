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
 *
 * Importante:
 * - NÃO existe mais controle por "status"
 * - O controle é baseado em histórico (reminder_logs)
 */
export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  /**
   * Carrega os lembretes ao montar o componente
   */
  useEffect(() => {
    async function loadReminders() {
      try {
        const data = await getReminders();
        setReminders(data);
      } catch (error) {
        console.error("Erro ao carregar lembretes:", error);
      }
    }

    loadReminders();
  }, []);

  /**
   * Aceitar lembrete
   *
   * Fluxo:
   * 1. Salva histórico no backend
   * 2. Remove da UI
   * 3. Mostra feedback
   */
  async function acceptReminder(id: string) {
    try {
      await updateReminderStatus(id, "accepted");

      // Remove imediatamente da tela
      setReminders((prev) => prev.filter((r) => r.id !== id));

      setFeedback("Lembrete aceito");
    } catch (error) {
      console.error(error);
      setFeedback("Erro ao atualizar lembrete");
    }
  }

  /**
   * Adiar lembrete
   *
   * Mesmo comportamento do accept
   */
  async function postponeReminder(id: string) {
    try {
      await updateReminderStatus(id, "postponed");

      // Remove imediatamente da tela
      setReminders((prev) => prev.filter((r) => r.id !== id));

      setFeedback("Lembrete adiado");
    } catch (error) {
      console.error(error);
      setFeedback("Erro ao atualizar lembrete");
    }
  }

  /**
   * Controle de exibição do toast
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
  };
}
