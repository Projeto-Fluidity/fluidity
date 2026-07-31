import webpush from "web-push";

import { ENV } from "../config/env.js";

import { supabase } from "../lib/supabase.js";

/**
 * ============================================================
 * VAPID CONFIG
 * ============================================================
 *
 * Web Push utiliza VAPID keys
 * para autenticação das notificações.
 *
 * Essas chaves identificam
 * o servidor emissor.
 */
webpush.setVapidDetails(
  "mailto:contato@fluidity.app",

  ENV.VAPID_PUBLIC_KEY,

  ENV.VAPID_PRIVATE_KEY,
);

/**
 * ============================================================
 * TYPES
 * ============================================================
 */

export type PushMessage = {
  title: string;
  body: string;
  url?: string;
};

/**
 * ============================================================
 * SEND PUSH TO DEVICE
 * ============================================================
 *
 * Responsável por:
 *
 * - localizar subscriptions do dispositivo;
 * - montar payload da notificação;
 * - enviar push notifications;
 * - remover subscriptions inválidas.
 *
 * ============================================================
 * FLUXO
 * ============================================================
 *
 * device_id
 *   ↓
 * Supabase
 *   ↓
 * subscriptions
 *   ↓
 * Web Push API
 *   ↓
 * Navegador
 */
export async function sendPushToUser(userId: string, message: PushMessage) {
  /**
   * ==========================================================
   * GET SUBSCRIPTIONS
   * ==========================================================
   */

  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId);
  console.log("========================================");
  console.log("SEND PUSH");
  console.log("User:", userId);
  console.log("Subscriptions encontradas:", subscriptions?.length ?? 0);

  /**
   * ==========================================================
   * SUPABASE ERROR
   * ==========================================================
   */

  if (error) {
    throw new Error(error.message);
  }

  /**
   * ==========================================================
   * SUBSCRIPTION NOT FOUND
   * ==========================================================
   */

  if (!subscriptions || subscriptions.length === 0) {
    throw new Error("Subscription não encontrada");
  }

  /**
   * ==========================================================
   * PAYLOAD
   * ==========================================================
   *
   * Payload enviado ao navegador.
   *
   * IMPORTANTE:
   *
   * O icon precisa utilizar
   * URL pública acessível externamente.
   *
   * localhost NÃO funciona
   * em ambiente cloud.
   */
  const payload = JSON.stringify({
    title: message.title,

    body: message.body,

    url: message.url || "/",

    icon: "https://fluidity.vercel.app/icons/192.png",
  });

  /**
   * ==========================================================
   * SEND PUSH
   * ==========================================================
   */
  
  console.log(
    "Subscription IDs:",
    subscriptions?.map((sub) => sub.id),
  );
for (const sub of subscriptions) {

  console.log("----------------------------------------");
  console.log("Endpoint:");
  console.log(sub.endpoint);

  console.log("Payload:");
  console.log(payload);

  try {

    /**
     * ======================================================
     * WEB PUSH SEND
     * ======================================================
     */

    const response = await webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      },
      payload,
    );

    console.log("✅ Push enviado");
    console.log(response);

  } catch (err: unknown) {

    console.error("========================================");
    console.error("❌ Erro ao enviar Push Notification");

    console.error(err);

    type WebPushError = {
      statusCode?: number;
      body?: string;
      headers?: unknown;
    };

    const error = err as WebPushError;

    console.error("STATUS:", error.statusCode);
    console.error("BODY:", error.body);
    console.error("HEADERS:", error.headers);

    /**
     * ======================================================
     * REMOVE INVALID SUBSCRIPTION
     * ======================================================
     */

    if (
      error.statusCode === 404 ||
      error.statusCode === 410
    ) {

      console.warn(
        "⚠️ Subscription inválida. Removendo do banco..."
      );

      const { error: deleteError } =
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("endpoint", sub.endpoint);

      if (deleteError) {

        console.error(
          "Erro ao remover subscription inválida:",
          deleteError,
        );

      } else {

        console.log(
          "✅ Subscription removida com sucesso."
        );

      }
    }
  }
}
}
