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
 * Sua única responsabilidade é persistir
 * a data em que o usuário dispensou
 * temporariamente o convite de instalação.
 *
 * Esse armazenamento representa apenas
 * uma preferência da interface e não o
 * estado de instalação do PWA.
 *
 * Não possui dependência de React.
 * Não possui dependência de UI.
 */

const STORAGE_KEY = "fluidity:install-prompt-dismissed";

/**
 * ============================================================
 * GET INSTALL PROMPT DISMISSED AT
 * ============================================================
 *
 * Recupera a data em que o usuário dispensou
 * o convite de instalação.
 *
 * Retorna:
 *
 * - data em formato ISO;
 * - null quando o convite nunca foi dispensado.
 */
export function getInstallPromptDismissedAt(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

/**
 * ============================================================
 * MARK INSTALL PROMPT DISMISSED
 * ============================================================
 *
 * Registra o instante atual em que o usuário
 * optou por não visualizar o convite.
 *
 * Essa informação será utilizada pela
 * política de exibição para decidir quando
 * o convite poderá reaparecer.
 */
export function markInstallPromptDismissed(): void {
  localStorage.setItem(
    STORAGE_KEY,
    new Date().toISOString(),
  );
}

/**
 * ============================================================
 * CLEAR INSTALL PROMPT DISMISSED
 * ============================================================
 *
 * Remove o registro da dispensa.
 *
 * Utilizado principalmente por cenários de QA
 * e testes automatizados.
 */
export function clearInstallPromptDismissed(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * ============================================================
 * RESET INSTALL PROMPT STATE
 * ============================================================
 *
 * Utilitário para QA.
 */
export function resetInstallPromptState(): void {
  clearInstallPromptDismissed();
}
