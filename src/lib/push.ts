/**
 * ============================================================
 * PUSH SERVICE (FRONTEND)
 * ============================================================
 *
 * Responsável por:
 * - Registrar o Service Worker
 * - Solicitar permissão de notificação ao usuário
 * - Criar subscription de push
 * - Persistir subscription no banco (Supabase)
 *
 * Observações:
 * - Executar apenas em ambiente com suporte a Service Worker
 * - Requer chave pública VAPID
 * ============================================================
 */

import { supabase } from "../services/supabaseClient";
import { getDeviceId } from "./deviceId";

/**
 * Chave pública VAPID (gerada via web-push)
 */
const PUBLIC_VAPID_KEY = "COLE_SUA_PUBLIC_KEY_AQUI";

/**
 * ============================================================
 * UTIL: converter base64 → Uint8Array
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
  /**
   * Verifica suporte do navegador
   */
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Worker não suportado");
    return;
  }

  /**
   * Solicita permissão de notificação
   */
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.warn("Permissão de notificação negada");
    return;
  }

  /**
   * Registra o Service Worker
   */
  const registration = await navigator.serviceWorker.register("/sw.js");

  /**
   * Cria subscription de push
   */
  const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    } as PushSubscriptionOptionsInit);

  /**
   * Persiste no banco
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
