import { env } from "../config/env";

/**
 * ============================================================
 * TYPES
 * ============================================================
 *
 * Payload esperado pelo push-server.
 *
 * device_id:
 * Identificador único persistido no navegador.
 *
 * title/body/url:
 * Dados da notificação.
 *
 * Todos os campos além do device_id
 * são opcionais porque o backend já possui
 * fallback/default values.
 */
type SendPushPayload = {
  device_id: string;

  title?: string;
  body?: string;
  url?: string;
};

/**
 * ============================================================
 * SEND PUSH NOTIFICATION
 * ============================================================
 *
 * Responsabilidade:
 *
 * Encapsular a comunicação do frontend
 * com a infraestrutura de notificações.
 *
 * ============================================================
 * POR QUE ESSE SERVICE EXISTE?
 * ============================================================
 *
 * Evitamos que páginas/components conheçam:
 *
 * - URLs;
 * - endpoints;
 * - fetch;
 * - headers;
 * - detalhes de infraestrutura.
 *
 * Isso reduz:
 *
 * - acoplamento;
 * - duplicação;
 * - dependência direta do backend.
 *
 * ============================================================
 * FLUXO
 * ============================================================
 *
 * Frontend
 *   ↓
 * notificationService
 *   ↓
 * Push Server
 *   ↓
 * Web Push Provider
 *   ↓
 * Navegador
 */
export async function sendPushNotification(
  payload: SendPushPayload
) {

  /**
   * ==========================================================
   * REQUEST
   * ==========================================================
   *
   * O backend responsável pelo envio
   * de notificações push está desacoplado
   * do frontend.
   *
   * A URL é resolvida via environment config.
   */
  const response = await fetch(
    `${env.pushApiUrl}/send-push`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    }
  );

  /**
   * ==========================================================
   * ERROR HANDLING
   * ==========================================================
   */
  if (!response.ok) {

    throw new Error(
      "Erro ao enviar push notification"
    );
  }

  /**
   * ==========================================================
   * SUCCESS RESPONSE
   * ==========================================================
   */
  return response.json();
}
