import dotenv from "dotenv";
import webpush from "web-push";
import { supabase } from "../lib/supabase.js";

dotenv.config();

// ============================================================
// VAPID
// ============================================================

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;

// ============================================================
// CONFIG
// ============================================================

webpush.setVapidDetails(
  "mailto:contato@fluidity.app",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// ============================================================
// TYPES
// ============================================================

export type PushMessage = {
  title: string;
  body: string;
  url?: string;
};

// ============================================================
// SEND PUSH BY DEVICE
// ============================================================

export async function sendPushToDevice(
  deviceId: string,
  message: PushMessage
) {
  // ==========================================================
  // GET SUBSCRIPTIONS
  // ==========================================================

  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("device_id", deviceId);

  if (error) {
    throw new Error(error.message);
  }

  if (!subscriptions || subscriptions.length === 0) {
    throw new Error("Subscription não encontrada");
  }

  // ==========================================================
  // PAYLOAD
  // ==========================================================

  const payload = JSON.stringify({
    title: message.title,
    body: message.body,
    url: message.url || "/",
    icon: "http://localhost:5173/icons/192.png",
  });

  // ==========================================================
  // SEND
  // ==========================================================

  for (const sub of subscriptions) {
    try {
      console.log("=================================");
      console.log("ENVIANDO PUSH...");
      console.log("DEVICE ID:", deviceId);
      console.log("ENDPOINT:", sub.endpoint);

      console.log("PAYLOAD:");
      console.log(payload);

      const response = await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payload
      );

      console.log("=================================");
      console.log("PUSH ENVIADO COM SUCESSO");
      console.log("STATUS:", response.statusCode);
      console.log("HEADERS:", response.headers);

    } catch (err: unknown) {
      console.error("=================================");
      console.error("ERRO AO ENVIAR PUSH");
      console.error(err);

      const error = err as {
        statusCode?: number;
        body?: string;
      };

      console.error("STATUS:", error.statusCode);
      console.error("BODY:", error.body);

      /**
       * REMOVE SUB INVÁLIDA
       */
          if (
        error.statusCode === 404 ||
        error.statusCode === 410
      ) {
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("endpoint", sub.endpoint);

        console.log("Subscription removida");
      }
    }
  }
}
