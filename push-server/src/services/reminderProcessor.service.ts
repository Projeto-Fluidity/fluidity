import {
  getActiveReminders,
  type ScheduledReminder,
} from "./reminder.service.js";

import {
  getScheduledFor,
  shouldRunReminder,
} from "./reminderScheduler.service.js";
import { claimDelivery } from "../repositories/reminderDelivery.repository.js";

import { isReminderEnabled } from "./reminderSettings.service.js";

/**
 * ============================================================
 * REMINDER PROCESSOR SERVICE
 * ============================================================
 *
 * Responsável por orquestrar o processamento dos lembretes.
 *
 * Este serviço conecta as diferentes responsabilidades
 * da arquitetura, mas não implementa suas regras internas.
 *
 * Responsabilidades:
 *
 * - buscar lembretes ativos;
 * - solicitar a avaliação da regra de agendamento;
 * - calcular a ocorrência;
 * - reservar a ocorrência para processamento.
 *
 * Este serviço NÃO é responsável por:
 *
 * - implementar regras de horário ou dias;
 * - acessar diretamente o Supabase;
 * - controlar a idempotência;
 * - enviar Push Notifications.
 *
 * Essas responsabilidades pertencem às respectivas camadas.
 *
 * ============================================================
 * FLUXO
 * ============================================================
 *
 * reminder.service
 *        ↓
 * lembretes ativos
 *        ↓
 * reminderScheduler.service
 *        ↓
 * ocorrência elegível
 *        ↓
 * reminderDelivery.repository
 *        ↓
 * ocorrência reservada
 *
 * A entrega do Push será integrada posteriormente.
 */

/**
 * ============================================================
 * TIPOS
 * ============================================================
 */

/**
 * Representa uma ocorrência de lembrete autorizada
 * para processamento.
 *
 * O Push ainda não é enviado neste estágio.
 */
export type DueReminder = {
  reminder: ScheduledReminder;
  scheduledFor: Date;
};

/**
 * ============================================================
 * PROCESSAMENTO
 * ============================================================
 *
 * Busca os lembretes ativos e identifica quais ocorrências
 * estão prontas para serem processadas.
 *
 * A função não envia notificações.
 */
export async function processDueReminders(
  now: Date = new Date(),
): Promise<DueReminder[]> {
  const reminders = await getActiveReminders();

  const enabledByUser = new Map<string, boolean>();

  const dueReminders: DueReminder[] = [];

  for (const reminder of reminders) {
    /**
     * Verifica se as notificações estão habilitadas
     * para o usuário.
     *
     * A configuração é consultada uma única vez
     * por usuário durante esta execução.
     */
    let enabled = enabledByUser.get(reminder.user_id);

    if (enabled === undefined) {
      enabled = await isReminderEnabled(reminder.user_id);

      enabledByUser.set(reminder.user_id, enabled);
    }

    if (!enabled) {
      continue;
    }

    /**
     * Verifica as regras de horário e dia.
     */
    if (!shouldRunReminder(reminder, now)) {
      continue;
    }

    /**
     * Calcula o instante exato da ocorrência.
     */
    const scheduledFor = getScheduledFor(reminder, now);

    if (!scheduledFor) {
      continue;
    }

    /**
     * Reserva a ocorrência no banco.
     *
     * Se outra execução já tiver reservado a mesma
     * ocorrência, claimDelivery retorna false.
     */
    const claimed = await claimDelivery(
      reminder.id,
      scheduledFor,
    );

    if (!claimed) {
      continue;
    }

    /**
     * Esta ocorrência foi reservada por esta execução
     * e está pronta para a próxima etapa do processamento.
     */
    dueReminders.push({
      reminder,
      scheduledFor,
    });
  }

  return dueReminders;
}
