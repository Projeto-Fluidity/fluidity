/**
 * ============================================================
 * PWA INSTALL STORAGE
 * ============================================================
 *
 * Responsável por persistir informações
 * relacionadas à instalação do PWA.
 *
 * Não possui dependência de React.
 * Não possui dependência de UI.
 */

const STORAGE_KEY =
  "fluidity:pwa-installed";

/**
 * Verifica se o usuário já instalou
 * o aplicativo.
 */
export function isPWAInstalled(): boolean {
  return (
    localStorage.getItem(STORAGE_KEY) ===
    "true"
  );
}

/**
 * Marca o aplicativo como instalado.
 */
export function markPWAInstalled(): void {
  localStorage.setItem(
    STORAGE_KEY,
    "true"
  );
}

/**
 * Verifica se o aplicativo
 * está rodando como PWA instalado.
 */
export function isRunningAsPWA(): boolean {
  return window.matchMedia(
    "(display-mode: standalone)"
  ).matches;
}

/**
 * Utilitário para QA.
 */
export function resetPWAInstallState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
