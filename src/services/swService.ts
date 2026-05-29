/**
 * ============================================================
 * SERVICE WORKER READY
 * ============================================================
 *
 * Centraliza:
 *
 * - espera do SW;
 * - timeout;
 * - logs;
 * - futuras estratégias de retry.
 */

const DEFAULT_TIMEOUT = 10000;

/**
 * ============================================================
 * GET SW READY
 * ============================================================
 */

export async function getSWReady(
  timeout = DEFAULT_TIMEOUT,
): Promise<ServiceWorkerRegistration> {

  /**
   * ==========================================================
   * TIMEOUT
   * ==========================================================
   */

  const timeoutPromise =
    new Promise<never>((_, reject) => {

      window.setTimeout(() => {

        reject(
          new Error(
            "SERVICE WORKER READY TIMEOUT"
          )
        );

      }, timeout);
    });

  /**
   * ==========================================================
   * READY PROMISE
   * ==========================================================
   */

  const readyPromise =
    navigator.serviceWorker.ready;

  /**
   * ==========================================================
   * RACE
   * ==========================================================
   */

  const registration =
    await Promise.race([
      readyPromise,
      timeoutPromise,
    ]);

  return registration;
}
