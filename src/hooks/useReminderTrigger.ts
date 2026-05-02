import { useEffect, useRef } from "react";
import { getScheduledReminders } from "../services/reminderService";
import {
  shouldTriggerReminder,
  toUiReminder,
} from "../lib/reminderAdapter";

/**
 * ============================================================
 * TRIGGER DE LEMBRETES (LOCAL)
 * ============================================================
 *
 * Responsável por:
 * - Verificar lembretes periodicamente
 * - Disparar no horário correto (janela controlada)
 * - Evitar repetição no mesmo dia
 * - Rodar apenas uma vez (StrictMode safe)
 */
export function useReminderTrigger() {
  const triggeredRef = useRef<Set<string>>(new Set());
  const startedRef = useRef(false);
  const lastResetDateRef = useRef<string | null>(null);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    console.log("Trigger iniciado");

    async function runTrigger() {
      const now = new Date();

      /**
       * RESET DIÁRIO
       */
      const todayKey = now.toDateString();

      if (lastResetDateRef.current !== todayKey) {
        console.log("Reset diário de disparos");
        triggeredRef.current.clear();
        lastResetDateRef.current = todayKey;
      }

      const reminders = await getScheduledReminders();

      reminders.forEach((r) => {
        const alreadyTriggered = triggeredRef.current.has(r.id);

        const shouldTrigger = shouldTriggerReminder(
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
              now: now.toTimeString().slice(0, 5),
              shouldTrigger,
              alreadyTriggered,
            },
            null,
            2
          )
        );

        if (!shouldTrigger) return;

        const ui = toUiReminder(r);

        console.log("DISPARANDO LEMBRETE:", ui.title);

        alert(`${ui.title}\n${ui.description}`);

        triggeredRef.current.add(r.id);
      });
    }

    // executa imediatamente
    runTrigger();

    // loop a cada 30s
    const interval = setInterval(runTrigger, 30 * 1000);

    return () => clearInterval(interval);
  }, []);
}
