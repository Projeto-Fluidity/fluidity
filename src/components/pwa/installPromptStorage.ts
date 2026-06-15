/**
 * ============================================================
 * PWA INSTALL PROMPT STORAGE
 * ============================================================
 *
 * Responsável por persistir informações
 * relacionadas ao convite de instalação do PWA.
 *
 * Não possui dependência de React.
 * Não possui dependência de UI.
 */

const STORAGE_KEY =
  "fluidity:pwa-install-prompt-seen";

/**
 * Verifica se o usuário já visualizou
 * o convite de instalação.
 */
export function hasSeenInstallPrompt(): boolean {
  return (
    localStorage.getItem(STORAGE_KEY) ===
    "true"
  );
}

/**
 * Marca o convite como já exibido.
 */
export function markInstallPromptAsSeen(): void {
  localStorage.setItem(
    STORAGE_KEY,
    "true"
  );
}

/**
 * Utilitário para QA.
 */
export function resetInstallPrompt(): void {
  localStorage.removeItem(STORAGE_KEY);
}
