/**
 * ============================================================
 * PWA INSTALL PROMPT STORAGE
 * ============================================================
 *
 * Responsável por persistir preferências relacionadas
 * ao convite de instalação do aplicativo.
 *
 * Este armazenamento NÃO representa o estado de instalação
 * do PWA.
 *
 * Sua única responsabilidade é registrar preferências
 * da interface, como o usuário ter dispensado o convite.
 *
 * Não possui dependência de React.
 * Não possui dependência de UI.
 */

const STORAGE_KEY = "fluidity:install-prompt-dismissed";

/**
 * Verifica se o usuário optou por
 * não visualizar novamente o convite
 * de instalação.
 */

export function hasDismissedInstallPrompt(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

/**
 * Registra que o usuário dispensou
 * o convite de instalação.
 */

export function markInstallPromptDismissed(): void {
  localStorage.setItem(STORAGE_KEY, "true");
}

/**
 * Utilitário para QA.
 */
export function resetInstallPromptState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
