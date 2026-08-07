import type { UiReminder } from "../lib/reminderAdapter";
import { sendPushNotification } from "./notificationService";

/**
 * ============================================================
 * REMINDER DELIVERY SERVICE
 * ============================================================
 *
 * Responsável por entregar um lembrete ao usuário.
 *
 * ============================================================
 * RESPONSABILIDADE
 * ============================================================
 *
 * Este serviço representa a camada de entrega
 * dos lembretes da aplicação.
 *
 * Ele NÃO é responsável por:
 *
 * - verificar horários;
 * - decidir quando disparar;
 * - consultar banco de dados;
 * - gerenciar schedulers;
 * - controlar intervalos.
 *
 * Essas responsabilidades pertencem ao
 * useReminderTrigger.
 *
 * ============================================================
 * ARQUITETURA
 * ============================================================
 *
 * useReminderTrigger
 *          │
 *          ▼
 * reminderDeliveryService
 *          │
 *          ▼
 * Canal de entrega
 *
 * Nesta primeira versão o canal de entrega
 * permanece sendo um alert(), preservando
 * exatamente o comportamento atual.
 *
 * Futuramente este serviço poderá utilizar:
 *
 * - Push Notifications
 * - Notification API
 * - Notification Center
 *
 * sem necessidade de alterar o scheduler.
 */

/**
 * ============================================================
 * ENTREGA DE LEMBRETE
 * ============================================================
 *
 * Recebe um lembrete previamente validado
 * pelo scheduler e realiza sua entrega
 * utilizando o canal atualmente disponível.
 */
export async function deliver(
  userId: string,
  reminder: UiReminder,
): Promise<void> {
  try {
    const url = reminder.category === "hydration" ? "/water" : "/";
    await sendPushNotification({
      user_id: userId,
      title: reminder.title,
      body: reminder.description,
      url,
      category: reminder.category,
    });
  } catch (error) {
    console.error("Erro ao entregar lembrete:", error);
  }
}
