import { env } from "../config/env";

/**
 * ============================================================
 * TYPES
 * ============================================================
 *
 * Payload esperado pelo push-server.
 *
 * user_id:
 * Identificador único do usuário autenticado.

 * A resolução dos dispositivos associados é responsabilidade
 * do Push Server, refletindo a arquitetura N:N adotada pelo
 * Fluidity.
 *
 * title/body/url:
 * Dados da notificação.
 *
 * Todos os campos além do user_id
 * são opcionais porque o backend possui
 * valores padrão para título, corpo e URL.
 */
type SendPushPayload = {
  user_id: string;

  title?: string;
  body?: string;
  url?: string;
};

type SendPushResponse = {
  success: boolean;
  message: string;
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
  payload: SendPushPayload,
): Promise<SendPushResponse> {

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

    const message = await response.text();

    throw new Error(
      `Erro ao enviar push notification: ${message}`,
    );
  }

  /**
   * ==========================================================
   * SUCCESS RESPONSE
   * ==========================================================
   */
  const result: SendPushResponse = await response.json();

  return result;
}
