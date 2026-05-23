/**
 * ============================================================
 * PUSH SERVICE (FRONTEND)
 * ============================================================
 */

import { supabase } from "../services/supabaseClient";
import { getDeviceId } from "./deviceId";
import { registerSW } from "virtual:pwa-register";

/**
 * Chave pública VAPID
 */
const PUBLIC_VAPID_KEY = "BPEn32mXPKq94YXJ0vH-7Xud8rCfGCN6txV04maCcSIy8KIckTCkohWn4m7ieORWbMx68xz8ZVtkzreuv32IgQ8";

/**
 * ============================================================
 * REGISTRO DO SERVICE WORKER (via VitePWA)
 * ============================================================
 */
registerSW({
  immediate: true,
});

/**
 * ============================================================
 * UTIL: base64 → Uint8Array
 * ============================================================
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((char) => char.charCodeAt(0))
  );
}

/**
 * ============================================================
 * REGISTRAR PUSH
 * ============================================================
 */
export async function registerPush(): Promise<void> {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Worker não suportado");
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.warn("Permissão negada");
    return;
  }

  /**
   * Pega o SW já registrado pelo plugin
   */
  const registration = await navigator.serviceWorker.getRegistration();

  if (!registration) {
    throw new Error("Service Worker não registrado");
  }

  /**
   * Subscription
   */
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey:
      urlBase64ToUint8Array(PUBLIC_VAPID_KEY) as BufferSource,
  });

  /**
   * Persistência
   */
  const deviceId = getDeviceId();

  const { error } = await supabase.from("push_subscriptions").insert({
    device_id: deviceId,
    endpoint: subscription.endpoint,
    p256dh: subscription.toJSON().keys?.p256dh,
    auth: subscription.toJSON().keys?.auth,
  });

  if (error) {
    console.error("Erro ao salvar subscription:", error);
  } else {
    console.log("Push registrado com sucesso");
  }
}
