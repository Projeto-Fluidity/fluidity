import { processDueReminders } from "./reminderProcessor.service.js";
import { buildReminderNotification } from "./reminderNotification.service.js";
import { sendPushToUser } from "./push.service.js";

/**
 * ============================================================
 * REMINDER SCHEDULER RUNNER
 * ============================================================
 *
 * Executa o processamento automático dos lembretes
 * e encaminha as ocorrências elegíveis para o Push.
 *
 * Não contém regras de agendamento ou persistência.
 */

/**
 * Processa os lembretes que estão prontos para execução.
 */
export async function runReminderScheduler(): Promise<void> {
  const dueReminders = await processDueReminders();

  for (const { reminder } of dueReminders) {
    const notification = buildReminderNotification(reminder);

    await sendPushToUser(reminder.user_id, notification);
  }
}
