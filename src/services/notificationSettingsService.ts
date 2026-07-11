import { createOrGetSubscription, unsubscribePush } from "./pushService";

import { getSettings, saveSettings } from "./settingsService";

/**
 * ============================================================
 * TYPES
 * ============================================================
 */

/**
 * Configuração padrão utilizada quando o usuário
 * ainda não possui um registro persistido na tabela
 * reminder_settings.
 */
type NotificationSettings = {
  start_hour: number;
  end_hour: number;
  frequency_minutes: number;
  max_per_day: number;
  enabled: boolean;
};

/**
 * ============================================================
 * CONSTANTS
 * ============================================================
 */

/**
 * Valores padrão utilizados na criação das configurações
 * iniciais do usuário.
 *
 * Esses valores garantem que o serviço consiga realizar
 * um UPSERT mesmo quando ainda não existir um registro
 * persistido para o usuário.
 */
const DEFAULT_SETTINGS: NotificationSettings = {
  start_hour: 8,
  end_hour: 22,
  frequency_minutes: 60,
  max_per_day: 10,
  enabled: false,
};

/**
 * ============================================================
 * PRIVATE HELPERS
 * ============================================================
 */

/**
 * Carrega as configurações atuais do usuário.
 *
 * Caso ainda não exista um registro persistido,
 * retorna uma configuração padrão para permitir
 * que o fluxo continue normalmente.
 */
async function loadCurrentSettings(
  userId: string,
): Promise<NotificationSettings> {
  const settings = await getSettings(userId);

  return {
    start_hour: settings?.start_hour ?? DEFAULT_SETTINGS.start_hour,

    end_hour: settings?.end_hour ?? DEFAULT_SETTINGS.end_hour,

    frequency_minutes:
      settings?.frequency_minutes ?? DEFAULT_SETTINGS.frequency_minutes,

    max_per_day: settings?.max_per_day ?? DEFAULT_SETTINGS.max_per_day,

    enabled: settings?.enabled ?? DEFAULT_SETTINGS.enabled,
  };
}

/**
 * ============================================================
 * LOAD NOTIFICATION SETTINGS
 * ============================================================
 *
 * Recupera as configurações globais de notificações
 * do usuário autenticado.
 *
 * Esta função representa a API pública do serviço para
 * leitura das configurações.
 *
 * A implementação reutiliza o helper privado
 * loadCurrentSettings(), mantendo uma única fonte de
 * verdade para o carregamento das configurações.
 */
export async function loadNotificationSettings(
  userId: string,
): Promise<NotificationSettings> {
  return loadCurrentSettings(userId);
}

/**
 * ============================================================
 * ENABLE NOTIFICATIONS
 * ============================================================
 *
 * Responsável por habilitar o recebimento de
 * notificações do usuário.
 *
 * O identificador do usuário é recebido pela
 * camada superior para manter este serviço
 * desacoplado da implementação de autenticação.
 *
 * Fluxo:
 *
 * 1. Carrega as configurações atuais.
 * 2. Garante a existência da Push Subscription.
 * 3. Persiste a preferência do usuário.
 */
export async function enableNotifications(userId: string): Promise<void> {
  const settings = await loadCurrentSettings(userId);

  await createOrGetSubscription(userId);

  await saveSettings(userId, {
    ...settings,
    enabled: true,
  });
}

/**
 * ============================================================
 * DISABLE NOTIFICATIONS
 * ============================================================
 *
 * Responsável por desabilitar o recebimento de
 * notificações do usuário.
 *
 * O identificador do usuário é recebido pela
 * camada superior para manter este serviço
 * desacoplado da implementação de autenticação.
 *
 * Fluxo:
 *
 * 1. Carrega as configurações atuais.
 * 2. Remove a Push Subscription.
 * 3. Persiste a preferência do usuário.
 */
export async function disableNotifications(userId: string): Promise<void> {
  const settings = await loadCurrentSettings(userId);

  await unsubscribePush();

  await saveSettings(userId, {
    ...settings,
    enabled: false,
  });
}
