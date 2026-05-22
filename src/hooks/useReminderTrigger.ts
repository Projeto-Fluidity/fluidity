import { useEffect, useRef } from "react";

import { getScheduledReminders } from "../services/reminderService";

import {
  shouldTriggerReminder,
  toUiReminder,
} from "../lib/reminderAdapter";

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
  const triggeredRef =
    useRef<Set<string>>(new Set());

  /**
   * ============================================================
   * CONTROLE DE RESET DIÁRIO
   * ============================================================
   */
  const lastResetDateRef =
    useRef<string | null>(null);

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
    if (window.__REMINDER_TRIGGER_STARTED__) {

      console.log(
        "Trigger já iniciado — ignorando nova instância"
      );

      return;
    }

    /**
     * Marca scheduler como iniciado
     */
    window.__REMINDER_TRIGGER_STARTED__ = true;

    console.log("Trigger iniciado");

    /**
     * ============================================================
     * LOOP PRINCIPAL
     * ============================================================
     */
    async function runTrigger() {

      const now = new Date();

      /**
       * ============================================================
       * RESET DIÁRIO
       * ============================================================
       *
       * Todo novo dia:
       * - limpa reminders já disparados
       * - permite novos disparos
       */
      const todayKey =
        now.toDateString();

      if (
        lastResetDateRef.current !== todayKey
      ) {

        console.log(
          "Reset diário de disparos"
        );

        triggeredRef.current.clear();

        lastResetDateRef.current =
          todayKey;
      }

      /**
       * ============================================================
       * BUSCAR LEMBRETES
       * ============================================================
       */
      const reminders =
        await getScheduledReminders();

      /**
       * ============================================================
       * VERIFICAR CADA LEMBRETE
       * ============================================================
       */
      reminders.forEach((r) => {

        const alreadyTriggered =
          triggeredRef.current.has(r.id);

        const shouldTrigger =
          shouldTriggerReminder(
            r,
            now,
            alreadyTriggered
          );

        console.log(
          "CHECK TRIGGER",
          JSON.stringify(
            {
              label: r.label,
              time: r.time,
              now: now
                .toTimeString()
                .slice(0, 5),

              shouldTrigger,
              alreadyTriggered,
            },
            null,
            2
          )
        );

        /**
         * Não deve disparar
         */
        if (!shouldTrigger) return;

        /**
         * ============================================================
         * CONVERTER PARA UI
         * ============================================================
         */
        const ui =
          toUiReminder(r);

        console.log(
          "DISPARANDO LEMBRETE:",
          ui.title
        );

        /**
         * ============================================================
         * MVP TEMPORÁRIO
         * ============================================================
         *
         * Depois isso deve virar:
         * - Notification API
         * - Push notification
         * - ou integração SW
         */
        alert(
          `${ui.title}\n${ui.description}`
        );

        /**
         * Marca reminder como disparado
         */
        triggeredRef.current.add(r.id);
      });
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
    const interval =
      setInterval(
        runTrigger,
        30 * 1000
      );

    /**
     * ============================================================
     * CLEANUP
     * ============================================================
     *
     * Remove interval ao desmontar.
     */
    return () => {

      console.log(
        "Trigger finalizado"
      );

      clearInterval(interval);

      /**
       * Libera lock global
       */
      window.__REMINDER_TRIGGER_STARTED__ =
        false;
    };

  }, []);
}
