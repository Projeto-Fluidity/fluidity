import { saveSubscription } from "./pushSubscriptionService";

/**
 * ============================================================
 * UTIL: CONVERTER VAPID KEY (base64 → Uint8Array)
 * ============================================================
 *
 * A Push API do navegador exige Uint8Array,
 * mas a VAPID key vem como string base64.
 *
 * Essa função faz a conversão.
 */
function urlBase64ToUint8Array(
  base64String: string
): Uint8Array {

  const padding =
    "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 =
    (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((char) =>
      char.charCodeAt(0)
    )
  );
}

/**
 * ============================================================
 * CREATE OR GET SUBSCRIPTION
 * ============================================================
 *
 * Responsável por:
 *
 * - solicitar permissão;
 * - recuperar subscription existente;
 * - criar nova subscription quando necessário;
 * - salvar no banco.
 *
 * ============================================================
 * FLUXO:
 * ============================================================
 *
 * 1. Verifica status da permissão
 * 2. Aguarda Service Worker
 * 3. Verifica subscription existente
 * 4. Se existir → reutiliza
 * 5. Se não existir → cria nova
 * 6. Salva no Supabase
 */
export async function createOrGetSubscription():
  Promise<PushSubscription> {

  /**
   * ============================================================
   * STATUS DA PERMISSÃO
   * ============================================================
   */
  const currentPermission =
    Notification.permission;

  /**
   * ============================================================
   * PERMISSÃO NEGADA
   * ============================================================
   *
   * O navegador bloqueará notificações.
   */
  if (currentPermission === "denied") {

    throw new Error(
      "Notificações bloqueadas pelo usuário"
    );
  }

  /**
   * ============================================================
   * PERMISSÃO AINDA NÃO DEFINIDA
   * ============================================================
   *
   * O navegador exibirá o popup de autorização.
   */
  if (currentPermission === "default") {

    const permission =
      await Notification.requestPermission();

    if (permission !== "granted") {

      throw new Error(
        "Permissão para notificações não concedida"
      );
    }
  }

  /**
   * ============================================================
   * SERVICE WORKER READY
   * ============================================================
   */

  const registration =
    await navigator.serviceWorker.ready;

  /**
   * ============================================================
   * VERIFICAR SUBSCRIPTION EXISTENTE
   * ============================================================
   *
   * Isso evita:
   *
   * - subscriptions duplicadas;
   * - múltiplos registros no banco;
   * - requests desnecessários;
   * - conflitos de VAPID.
   */
  const existingSubscription =
    await registration.pushManager.getSubscription();

  /**
   * ============================================================
   * SUBSCRIPTION JÁ EXISTE
   * ============================================================
   *
   * IMPORTANTE:
   *
   * Não recriamos a subscription.
   * Não salvamos novamente no banco.
   *
   * Apenas reutilizamos a existente.
   */
  if (existingSubscription) {

    return existingSubscription;
  }

  /**
   * ============================================================
   * CRIAR NOVA SUBSCRIPTION
   * ============================================================
   */
  const publicKey =
    import.meta.env.VITE_VAPID_PUBLIC_KEY;

  if (!publicKey) {

    throw new Error(
      "VAPID public key não definida no .env"
    );
  }

  const applicationServerKey =
    urlBase64ToUint8Array(publicKey);

  const subscription =
    await registration.pushManager.subscribe({
      userVisibleOnly: true,

      applicationServerKey:
        applicationServerKey as BufferSource,
    });

  /**
   * ============================================================
   * SALVAR NO SUPABASE
   * ============================================================
   *
   * Apenas novas subscriptions são persistidas.
   */
  await saveSubscription(subscription);

  /**
   * ============================================================
   * RETORNA NOVA SUBSCRIPTION
   * ============================================================
   */
  return subscription;
  
}

/**
 * ============================================================
 * HAS PUSH SUBSCRIPTION
 * ============================================================
 *
 * Verifica se o navegador já possui
 * uma subscription ativa.
 *
 * Isso permite sincronizar a UI
 * com o estado real do Push API.
 */
export async function hasPushSubscription():
  Promise<boolean> {

  /**
   * ============================================================
   * SERVICE WORKER READY
   * ============================================================
   */
  const registration =
    await navigator.serviceWorker.ready;

  /**
   * ============================================================
   * BUSCA SUBSCRIPTION
   * ============================================================
   */
  const subscription =
    await registration
      .pushManager
      .getSubscription();

  /**
   * ============================================================
   * RETORNA BOOLEAN
   * ============================================================
   */
  return !!subscription;
}

/**
 * ============================================================
 * UNSUBSCRIBE PUSH
 * ============================================================
 *
 * Remove a subscription ativa do navegador.
 *
 * Fluxo:
 *
 * 1. Obtém Service Worker
 * 2. Busca subscription atual
 * 3. Remove subscription
 */
export async function unsubscribePush():
  Promise<void> {

  /**
   * ============================================================
   * SERVICE WORKER READY
   * ============================================================
   */
  const registration =
    await navigator.serviceWorker.ready;

  /**
   * ============================================================
   * BUSCA SUBSCRIPTION ATUAL
   * ============================================================
   */
  const subscription =
    await registration
      .pushManager
      .getSubscription();

  /**
   * ============================================================
   * NÃO EXISTE SUBSCRIPTION
   * ============================================================
   */
  if (!subscription) {
    return;
  }

  /**
   * ============================================================
   * REMOVE SUBSCRIPTION
   * ============================================================
   */
    await subscription.unsubscribe();
}
