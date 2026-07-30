import { useEffect, useRef } from "react";

import { getScheduledReminders } from "../services/reminderService";
import { getSettings } from "../services/settingsService";

import { shouldTriggerReminder, toUiReminder } from "../lib/reminderAdapter";
import { useAuth } from "./useAuth";
import { deliver } from "../services/reminderDeliveryService";
/**
 * ============================================================
 * GLOBAL WINDOW TYPE
 * ============================================================
 *
 * Adicionamos uma flag global no window para impedir
 * múltiplas instâncias do scheduler.
 *
 * Isso ajuda principalmente em:
 * - StrictMode
 * - múltiplos mounts
 * - navegação entre páginas
 * - hot reload
 */
declare global {
  interface Window {
    __REMINDER_TRIGGER_STARTED__?: boolean;
  }
}

/**
 * ============================================================
 * TRIGGER DE LEMBRETES (LOCAL)
 * ============================================================
 *
 * Responsável por:
 * - verificar lembretes periodicamente;
 * - disparar no horário correto;
 * - evitar repetição no mesmo dia;
 * - evitar múltiplos schedulers;
 * - funcionar com React StrictMode.
 */
export function useReminderTrigger() {
  /**
   * ============================================================
   * CONTROLE DE DISPAROS
   * ============================================================
   *
   * Guarda IDs já disparados no dia atual.
   */
  const { user } = useAuth();
  const triggeredRef = useRef<Set<string>>(new Set());

  /**
   * ============================================================
   * CONTROLE DE RESET DIÁRIO
   * ============================================================
   */
  const lastResetDateRef = useRef<string | null>(null);

  useEffect(() => {
    
    /**
     * ============================================================
     * PROTEÇÃO GLOBAL
     * ============================================================
     *
     * Impede criar múltiplos schedulers.
     *
     * Sem isso:
     * - múltiplas abas
     * - hot reload
     * - StrictMode
     * podem duplicar os intervals.
     */
    if (!user) {
      return;
    }

    if (window.__REMINDER_TRIGGER_STARTED__) {
      return;
    }

    /**
     * Marca scheduler como iniciado
     */
    window.__REMINDER_TRIGGER_STARTED__ = true;

    /**
     * ============================================================
     * LOOP PRINCIPAL
     * ============================================================
     */
async function runTrigger() {

  const now = new Date();

  /**
   * ============================================================
   * CONFIGURAÇÕES DO USUÁRIO
   * ============================================================
   *
   * Respeita a preferência global de notificações.
   *
   * Caso o usuário tenha desabilitado os lembretes,
   * nenhuma verificação adicional será realizada.
   */
  if (!user) {
    return;
  }

  const settings = await getSettings(user.id);

  /**
   * Caso as notificações estejam desabilitadas
   * globalmente, interrompe o processamento dos
   * lembretes.
   */
  if (!settings?.enabled) {
    return;
  }

  /**
   * ============================================================
   * RESET DIÁRIO
   * ============================================================
   *
   * Todo novo dia:
   * - limpa reminders já disparados;
   * - permite novos disparos.
   */
  const todayKey = now.toDateString();

  if (lastResetDateRef.current !== todayKey) {
    triggeredRef.current.clear();

    lastResetDateRef.current = todayKey;
  }

  /**
   * ============================================================
   * BUSCAR LEMBRETES
   * ============================================================
   */
  const reminders = await getScheduledReminders(user.id);

  /**
   * ============================================================
   * VERIFICAR CADA LEMBRETE
   * ============================================================
   */
  for (const reminder of reminders) {
    const alreadyTriggered =
      triggeredRef.current.has(reminder.id);

    const shouldTrigger = shouldTriggerReminder(
      reminder,
      now,
      alreadyTriggered,
    );

    /**
     * Não deve disparar.
     */
    if (!shouldTrigger) {
      continue;
    }

    /**
     * ==========================================================
     * CONVERTER PARA UI
     * ==========================================================
     */
    const uiReminder = toUiReminder(reminder);

  /**
   * ==========================================================
   * ENTREGA DO LEMBRETE
   * ==========================================================
   *
   * A responsabilidade de entregar o lembrete foi
   * delegada ao ReminderDeliveryService.
   *
   * Dessa forma, este hook permanece responsável
   * apenas pelo agendamento e pelas regras de
   * disparo, sem conhecer detalhes da infraestrutura
   * de entrega.
   */
  await deliver(user.id, uiReminder);

    /**
     * Marca o lembrete como disparado
     * para evitar duplicidade durante
     * o mesmo dia.
     */
    triggeredRef.current.add(reminder.id);
  };
}

    /**
     * ============================================================
     * EXECUÇÃO IMEDIATA
     * ============================================================
     */
    runTrigger();

    /**
     * ============================================================
     * LOOP RECORRENTE
     * ============================================================
     *
     * Verifica reminders a cada 30 segundos.
     */
    const interval = setInterval(runTrigger, 30 * 1000);

    /**
     * ============================================================
     * CLEANUP
     * ============================================================
     *
     * Remove interval ao desmontar.
     */
    return () => {
      clearInterval(interval);

      /**
       * Libera lock global
       */
      window.__REMINDER_TRIGGER_STARTED__ = false;
    };
  }, [user]);
}
