import type { PushMessage } from "./push.service.js";
import type { ScheduledReminder } from "./reminder.service.js";

/**
 * ============================================================
 * REMINDER NOTIFICATION SERVICE
 * ============================================================
 *
 * Responsável por transformar um lembrete agendado
 * em uma mensagem compatível com o serviço de Push.
 *
 * Não é responsável por:
 *
 * - buscar lembretes;
 * - verificar horário ou dias;
 * - controlar idempotência;
 * - enviar notificações.
 *
 * Essas responsabilidades pertencem às respectivas camadas.
 */

/**
 * Constrói a mensagem de Push correspondente ao lembrete.
 *
 * Os textos utilizados preservam o conteúdo atualmente
 * definido no fluxo de lembretes da aplicação.
 */
export function buildReminderNotification(
  reminder: ScheduledReminder,
): PushMessage {
  const isMood = reminder.category === "mood";

  return {
    title: "Momento de cuidar de você",

    body: isMood
      ? "Registre seu humor e acompanhe seu bem-estar"
      : "Hora de se hidratar e cuidar do seu corpo",

    url: isMood ? "/" : "/water",

    category: reminder.category,
  };
}
