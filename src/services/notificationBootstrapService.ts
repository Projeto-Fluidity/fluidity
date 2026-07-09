import { hasPushSubscription, createOrGetSubscription } from "./pushService";
import { getSettings } from "./settingsService";

/**
 * ============================================================
 * BOOTSTRAP RESULT
 * ============================================================
 *
 * Resultado da sincronização da infraestrutura de notificações.
 *
 * Essas informações são utilizadas apenas para fins
 * de diagnóstico e logging durante o bootstrap
 * da aplicação.
 */
export type NotificationBootstrapResult = {
  enabled: boolean;
  permission: NotificationPermission;
  hasSubscription: boolean;
  subscriptionCreated: boolean;
};

/**
 * ============================================================
 * NOTIFICATION BOOTSTRAP
 * ============================================================
 *
 * Responsável por garantir que a infraestrutura de
 * notificações esteja consistente com as preferências
 * persistidas do usuário.
 *
 * Este serviço NÃO altera configurações do usuário.
 *
 * Sua responsabilidade é apenas validar e, quando
 * possível, reconstruir automaticamente a infraestrutura
 * necessária para o recebimento de notificações.
 *
 * Fluxo:
 *
 * reminder_settings
 *          │
 *          ▼
 * notifications enabled?
 *          │
 *          ▼
 * browser permission?
 *          │
 *          ▼
 * push subscription?
 *          │
 *          ▼
 * criar subscription se necessário
 */
export async function bootstrapNotifications(): Promise<NotificationBootstrapResult> {
  /**
   * ==========================================================
   * USER SETTINGS
   * ==========================================================
   */

  const settings = await getSettings();

  const enabled = settings?.enabled ?? false;

  /**
   * Se o usuário desativou notificações,
   * nenhuma validação adicional é necessária.
   */
  if (!enabled) {
    return {
      enabled: false,
      permission: Notification.permission,
      hasSubscription: false,
      subscriptionCreated: false,
    };
  }

  /**
   * ==========================================================
   * NOTIFICATION PERMISSION
   * ==========================================================
   */

  if (Notification.permission !== "granted") {
    return {
      enabled: true,
      permission: Notification.permission,
      hasSubscription: false,
      subscriptionCreated: false,
    };
  }

  /**
   * ==========================================================
   * PUSH SUBSCRIPTION
   * ==========================================================
   */

  const hasSubscription =
    await hasPushSubscription();

  /**
   * Infraestrutura íntegra.
   */
  if (hasSubscription) {
    return {
      enabled: true,
      permission: Notification.permission,
      hasSubscription: true,
      subscriptionCreated: false,
    };
  }

  /**
   * ==========================================================
   * RECOVER SUBSCRIPTION
   * ==========================================================
   *
   * O usuário deseja receber notificações,
   * possui permissão concedida, porém a
   * Push Subscription não existe mais.
   *
   * Tentamos reconstruir automaticamente
   * a infraestrutura.
   */
  await createOrGetSubscription();

  return {
    enabled: true,
    permission: Notification.permission,
    hasSubscription: true,
    subscriptionCreated: true,
  };
}
