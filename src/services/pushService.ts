import { saveSubscription } from "./pushSubscriptionService";

/**
 * ============================================================
 * UTIL: CONVERTER VAPID KEY (base64 → Uint8Array)
 * ============================================================
 *
 * A chave pública VAPID vem como string (base64),
 * mas a API de Push do navegador exige um Uint8Array.
 *
 * Essa função faz essa conversão.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  /**
   * Ajusta o padding da base64 (necessário para decodificação correta)
   */
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  /**
   * Normaliza a string base64
   */
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  /**
   * Decodifica base64 para string binária
   */
  const rawData = window.atob(base64);

  /**
   * Converte string binária para Uint8Array
   */
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

/**
 * ============================================================
 * REGISTRAR PUSH NOTIFICATION
 * ============================================================
 *
 * Fluxo completo:
 *
 * 1. Solicita permissão ao usuário
 * 2. Aguarda o Service Worker estar pronto
 * 3. Cria a subscription com VAPID
 * 4. Salva a subscription no banco
 */
export async function registerPush(): Promise<PushSubscription> {
  console.log("1. solicitando permissão");

  const permission = await Notification.requestPermission();

  console.log("2. permission:", permission);

  if (permission !== "granted") {
    throw new Error("Permissão para notificações não concedida");
  }

  console.log("3. aguardando service worker ready");

  const registration = await navigator.serviceWorker.ready;

  console.log("4. service worker ready:", registration);

  const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

  console.log("5. publicKey:", publicKey);

  if (!publicKey) {
    throw new Error("VAPID public key não definida no .env");
  }

  const applicationServerKey =
    urlBase64ToUint8Array(publicKey);

  console.log("6. criando subscription");

  const subscription =
    await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey:
        applicationServerKey as unknown as BufferSource,
    });

  console.log("7. subscription criada:", subscription);

  console.log("8. salvando subscription");

  await saveSubscription(subscription);

  console.log("9. subscription salva");

  return subscription;
}