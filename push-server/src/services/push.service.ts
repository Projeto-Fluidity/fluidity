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

  ENV.VAPID_PRIVATE_KEY
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
export async function sendPushToDevice(
  deviceId: string,
  message: PushMessage
) {

  /**
   * ==========================================================
   * GET SUBSCRIPTIONS
   * ==========================================================
   */

  const {
    data: subscriptions,
    error,
  } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("device_id", deviceId);

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

  if (
    !subscriptions ||
    subscriptions.length === 0
  ) {

    throw new Error(
      "Subscription não encontrada"
    );
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

    icon:
      "https://fluidity.vercel.app/icons/192.png",
  });

  /**
   * ==========================================================
   * SEND PUSH
   * ==========================================================
   */

  for (const sub of subscriptions) {

    try {

      /**
       * ======================================================
       * WEB PUSH SEND
       * ======================================================
       */

      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,

          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },

        payload
      );

    } catch (err: unknown) {

      console.error(
        "Erro ao enviar push notification:",
        err
      );

      type WebPushError = {
        statusCode?: number;
        body?: string;
      };

      const error =
        err as WebPushError;

      console.error(
        "STATUS:",
        error.statusCode
      );

      console.error(
        "BODY:",
        error.body
      );

      /**
       * ======================================================
       * REMOVE INVALID SUBSCRIPTION
       * ======================================================
       *
       * 404 / 410:
       *
       * Subscription expirou
       * ou foi invalidada pelo navegador.
       */
      if (
        error.statusCode === 404 ||
        error.statusCode === 410
      ) {

        const { error: deleteError } =
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("endpoint", sub.endpoint);

        if (deleteError) {

          console.error(
            "Erro ao remover subscription inválida:",
            deleteError
          );
        }

      }
    }
  }
}
