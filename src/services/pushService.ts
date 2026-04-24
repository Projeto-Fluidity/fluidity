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
  /**
   * 1. Solicita permissão para notificações
   */
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Permissão para notificações não concedida");
  }

  /**
   * 2. Aguarda o Service Worker estar pronto
   */
  const registration = await navigator.serviceWorker.ready;

  /**
   * 3. Recupera a chave pública VAPID do .env
   */
  const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

  /**
   * Validação importante:
   * garante que a chave existe antes de usar
   */
  if (!publicKey) {
    throw new Error("VAPID public key não definida no .env");
  }

  /**
   * Converte a chave para o formato exigido pelo browser
   */
  const applicationServerKey = urlBase64ToUint8Array(publicKey);

  /**
   * Cria a subscription
   *
   * Observação:
   * O cast para Uint8Array é necessário pois o TypeScript
   * nem sempre consegue inferir corretamente o tipo retornado.
   */
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as unknown as BufferSource,
    });

  /**
   * 4. Salva no banco de dados
   */
  await saveSubscription(subscription);

  return subscription;
}