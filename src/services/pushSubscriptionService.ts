import { saveSubscription }
  from "./subscriptionService";

/**
 * ============================================================
 * VAPID PUBLIC KEY
 * ============================================================
 */

const VAPID_PUBLIC_KEY =
  import.meta.env.VITE_VAPID_PUBLIC_KEY;

/**
 * ============================================================
 * CONVERTE BASE64 → UINT8ARRAY
 * ============================================================
 *
 * A Push API exige a chave VAPID
 * em formato Uint8Array.
 */

function urlBase64ToUint8Array(
  base64String: string
) {
  const padding =
    "=".repeat(
      (4 - (base64String.length % 4)) % 4
    );

  const base64 =
    (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

  const rawData =
    window.atob(base64);

  const outputArray =
    new Uint8Array(rawData.length);

  for (
    let i = 0;
    i < rawData.length;
    ++i
  ) {
    outputArray[i] =
      rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * ============================================================
 * REGISTRA PUSH SUBSCRIPTION
 * ============================================================
 */

export async function registerPushNotifications() {

  /**
   * Verifica suporte
   */
  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
  ) {
    console.warn(
      "Push não suportado"
    );

    return;
  }

  /**
   * Permissão
   */
  const permission =
    await Notification.requestPermission();

  if (permission !== "granted") {
    console.warn(
      "Permissão negada"
    );

    return;
  }

  /**
   * Aguarda SW
   */
  const registration =
    await navigator.serviceWorker.ready;

  /**
   * Verifica subscription existente
   */
  let subscription =
    await registration.pushManager.getSubscription();

  /**
   * Cria nova subscription
   */
  if (!subscription) {

    subscription =
      await registration.pushManager.subscribe({
        userVisibleOnly: true,

        applicationServerKey:
          urlBase64ToUint8Array(
            VAPID_PUBLIC_KEY
          ),
      });
  }

  /**
   * Salva no banco
   */
  await saveSubscription(
    subscription
  );
}
