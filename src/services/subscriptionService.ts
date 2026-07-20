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
   * A Push Subscription é identificada unicamente pelo
   * device_id, conforme definido na ADR-0002.
   *
   * Quando um dispositivo já possui uma assinatura,
   * o registro existente é atualizado preservando
   * sua identidade.
   *
   * O user_id representa apenas o usuário atualmente
   * associado ao dispositivo.
   */

  const response = await fetch(
    `${url}/rest/v1/push_subscriptions?on_conflict=device_id`,
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

    console.error("Erro ao salvar Push Subscription:", errorText);

    throw new Error("Erro ao salvar Push Subscription");
  }
}

/**
 * ============================================================
 * ASSOCIATE USER TO DEVICE
 * ============================================================
 *
 * Atualiza o usuário associado ao dispositivo.
 *
 * A Push Subscription permanece inalterada.
 *
 * Apenas o campo user_id é atualizado.
 */
export async function associateUserToDevice(
  deviceId: string,
  userId: string,
): Promise<void> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const response = await fetch(
    `${url}/rest/v1/push_subscriptions?device_id=eq.${encodeURIComponent(deviceId)}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",

        apikey: key,

        Authorization: `Bearer ${key}`,
      },

      body: JSON.stringify({
        user_id: userId,
        updated_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "Erro ao associar usuário ao dispositivo:",
      errorText,
    );

    throw new Error(
      "Erro ao associar usuário ao dispositivo",
    );
  }
}

/**
 * ============================================================
 * CLEAR DEVICE ASSOCIATION
 * ============================================================
 *
 * Remove a associação entre o usuário e o
 * dispositivo atual.
 *
 * A Push Subscription permanece registrada.
 */
export async function clearDeviceAssociation(
  deviceId: string,
): Promise<void> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const response = await fetch(
    `${url}/rest/v1/push_subscriptions?device_id=eq.${encodeURIComponent(deviceId)}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",

        apikey: key,

        Authorization: `Bearer ${key}`,
      },

      body: JSON.stringify({
        user_id: null,
        updated_at: new Date().toISOString(),
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "Erro ao remover associação do dispositivo:",
      errorText,
    );

    throw new Error(
      "Erro ao remover associação do dispositivo",
    );
  }
}
