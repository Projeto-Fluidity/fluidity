import { getDeviceId } from "../lib/deviceId";

/**
 * ============================================================
 * SAVE PUSH SUBSCRIPTION
 * ============================================================
 *
 * Persiste a Push Subscription do navegador.
 *
 * Nesta etapa da migração mantemos o UPSERT por
 * device_id para preservar compatibilidade com a
 * infraestrutura atual.
 *
 * O registro já passa a armazenar:
 *
 * - user_id
 * - device_id
 * - endpoint
 * - user_agent
 * - last_seen_at
 *
 * Em uma etapa posterior o on_conflict será migrado
 * para a chave definitiva da nova arquitetura.
 */
export async function saveSubscription(
  userId: string,
  subscription: PushSubscription,
): Promise<void> {
  /**
   * ==========================================================
   * DEVICE
   * ==========================================================
   */

  const deviceId = getDeviceId();

  /**
   * ==========================================================
   * SUBSCRIPTION
   * ==========================================================
   */

  const json = subscription.toJSON();

  const endpoint = json.endpoint;
  const keys = json.keys;

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    throw new Error("Subscription inválida");
  }

  /**
   * ==========================================================
   * ENVIRONMENT
   * ==========================================================
   */

  const url = import.meta.env.VITE_SUPABASE_URL;

  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  /**
   * ==========================================================
   * UPSERT
   * ==========================================================
   *
   * Mantido temporariamente utilizando device_id
   * até a conclusão da migração do banco.
   */

  const response = await fetch(
    `${url}/rest/v1/push_subscriptions?on_conflict=user_id`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        apikey: key,

        Authorization: `Bearer ${key}`,

        Prefer: "resolution=merge-duplicates",
      },

      body: JSON.stringify({
        user_id: userId,

        device_id: deviceId,

        endpoint,

        p256dh: keys.p256dh,

        auth: keys.auth,

        user_agent: navigator.userAgent,

        last_seen_at: new Date().toISOString(),
      }),
    },
  );

  /**
   * ==========================================================
   * ERROR
   * ==========================================================
   */

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "Erro ao salvar Push Subscription:",
      errorText,
    );

    throw new Error(
      "Erro ao salvar Push Subscription",
    );
  }
}
