import { useEffect, useState } from "react";
import type { Reminder } from "../types/reminder";
import {
  getReminders,
  updateReminderStatus,
  resetReminders,
} from "../services/reminderService";


/**
 * Hook responsável por gerenciar os lembretes da aplicação.
 *
 * Centraliza:
 * - carregamento de dados
 * - atualização de status
 * - controle de feedback (toast)
 */
export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  /**
   * Carrega os lembretes ao iniciar o hook
   */

  useEffect(() => {
     async function initializeReminders() {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem("lastReminderReset");

    // Se ainda não resetou hoje → reseta
    if (lastReset !== today) {
      await resetReminders();
      localStorage.setItem("lastReminderReset", today);
    }

    // Carrega os lembretes
    const data = await getReminders();
    setReminders(data);
  }

  initializeReminders();
}, []);
  /**
   * Marca um lembrete como aceito
   */
  async function acceptReminder(id: string) {
    try {
      await updateReminderStatus(id, "accepted");

      setReminders((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "accepted" } : r
        )
      );

      setFeedback("Lembrete aceito");
    } catch (error) {
      console.error(error);
      setFeedback("Erro ao atualizar lembrete");
    }
  }

  /**
   * Marca um lembrete como adiado
   */
  async function postponeReminder(id: string) {
    try {
      await updateReminderStatus(id, "postponed");

      setReminders((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "postponed" } : r
        )
      );

      setFeedback("Lembrete adiado");
    } catch (error) {
      console.error(error);
      setFeedback("Erro ao atualizar lembrete");
    }
  }

  /**
   * Controla exibição do feedback temporário (toast)
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
