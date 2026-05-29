import { getDeviceId } from "../lib/deviceId";

/**
 * ============================================================
 * SALVAR SUBSCRIPTION NO BANCO (SEM HEADER CUSTOM)
 * ============================================================
 *
 * Estratégia atual:
 * - Não usamos headers customizados (x-device-id)
 * - RLS valida apenas via dados da linha (device_id)
 * - Utilizamos UPSERT para evitar duplicação
 *
 * Fluxo:
 * 1. Gera/recupera device_id
 * 2. Extrai dados da subscription
 * 3. Envia para o Supabase via REST
 * 4. Usa "merge-duplicates" para atualizar se já existir
 */

export async function saveSubscription(
  subscription: PushSubscription
): Promise<void> {
  
  /**
   * ============================================================
   * 1. IDENTIFICAÇÃO DO DISPOSITIVO
   * ============================================================
   */
  const deviceId = getDeviceId();

  /**
   * ============================================================
   * 2. EXTRAÇÃO DOS DADOS DA SUBSCRIPTION
   * ============================================================
   */
  const json = subscription.toJSON();

  const endpoint = json.endpoint;
  const keys = json.keys;
  
  /**
   * Validação básica
   */
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    throw new Error("Subscription inválida");
  }

  /**
   * ============================================================
   * 3. VARIÁVEIS DE AMBIENTE
   * ============================================================
   */
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  /**
   * ============================================================
   * 4. REQUEST PARA O SUPABASE (UPSERT)
   * ============================================================
   *
   * IMPORTANTE:
   * - NÃO usamos mais headers customizados
   * - "Prefer: resolution=merge-duplicates" faz UPSERT
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
        device_id: deviceId,
        endpoint: endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      }),
    }
  );

  /**
   * ============================================================
   * 5. TRATAMENTO DE ERRO
   * ============================================================
   */
  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "ERRO SUPABASE:",
      errorText
    );

    throw new Error("Erro ao salvar subscription");
  }
}
