import { saveSubscription } from "./subscriptionService";
import { getSWReady } from "./swService";

/**
 * ============================================================
 * VAPID PUBLIC KEY
 * ============================================================
 */

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

/**
 * ============================================================
 * UTIL: BASE64 → UINT8ARRAY
 * ============================================================
 */

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

/**
 * ============================================================
 * CREATE OR GET SUBSCRIPTION
 * ============================================================
 */

export async function createOrGetSubscription(
  userId: string,
): Promise<PushSubscription> {
  /**
   * ==========================================================
   * SUPORTE
   * ==========================================================
   */

  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push notifications não suportadas");
  }

  /**
   * ==========================================================
   * VAPID KEY
   * ==========================================================
   */

  if (!VAPID_PUBLIC_KEY) {
    throw new Error("VITE_VAPID_PUBLIC_KEY não definida");
  }

  /**
   * ==========================================================
   * PERMISSÃO
   * ==========================================================
   */

  if (Notification.permission === "denied") {
    throw new Error("Notificações bloqueadas pelo usuário");
  }

  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      throw new Error("Permissão não concedida");
    }
  }

  /**
   * ==========================================================
   * SERVICE WORKER READY
   * ==========================================================
   */

  const registration = await getSWReady();

  /**
   * ==========================================================
   * EXISTING SUB
   * ==========================================================
   */

  let subscription = await registration.pushManager.getSubscription();

  /**
   * ==========================================================
   * CREATE SUB
   * ==========================================================
   */

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,

      applicationServerKey: urlBase64ToUint8Array(
        VAPID_PUBLIC_KEY,
      ) as BufferSource,
    });
  }

  /**
   * ==========================================================
   * SAVE DB
   * ==========================================================
   */

  await saveSubscription(userId, subscription);

  return subscription;
}

/**
 * ============================================================
 * HAS PUSH SUBSCRIPTION
 * ============================================================
 *
 * Verifica se o navegador já possui uma Push Subscription
 * registrada.
 *
 * Diferente de createOrGetSubscription(), esta função
 * nunca solicita permissão nem cria uma nova assinatura.
 *
 * É utilizada em fluxos onde apenas precisamos saber se
 * existe uma assinatura ativa antes de sincronizar dados
 * com o servidor.
 */

export async function hasPushSubscription(): Promise<boolean> {
  const registration = await getSWReady();

  const subscription = await registration.pushManager.getSubscription();

  return subscription !== null;
}

/**
 * ============================================================
 * UNSUBSCRIBE PUSH
 * ============================================================
 */

export async function unsubscribePush(): Promise<void> {
  const registration = await getSWReady();

  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    return;
  }

  await subscription.unsubscribe();
}
