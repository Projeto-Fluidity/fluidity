/**
 * ============================================================
 * PWA INSTALL PROMPT POLICY
 * ============================================================
 *
 * Responsável por centralizar as regras de negócio que definem
 * quando o convite de instalação do Progressive Web App (PWA)
 * deve ser exibido ao usuário.
 *
 * Esta camada NÃO consulta APIs do navegador.
 *
 * Também NÃO realiza persistência em localStorage.
 *
 * Sua única responsabilidade é interpretar as informações
 * recebidas da camada de armazenamento e decidir se o convite
 * pode ser apresentado novamente.
 *
 * Essa separação evita que regras de negócio fiquem espalhadas
 * entre componentes React, Hooks e serviços de persistência,
 * facilitando futuras alterações da política de exibição.
 */

import { getInstallPromptDismissedAt } from "../storage/pwaInstallPromptStorage";

/**
 * Intervalo mínimo entre duas exibições
 * consecutivas do convite de instalação.
 */
const DISMISS_PERIOD_IN_DAYS = 15;

/**
 * ============================================================
 * SHOULD SHOW INSTALL PROMPT
 * ============================================================
 *
 * Determina se o convite de instalação pode ser exibido.
 *
 * Regras:
 *
 * • Nunca foi dispensado
 *      → exibe.
 *
 * • Foi dispensado há mais de 15 dias
 *      → exibe novamente.
 *
 * • Foi dispensado recentemente
 *      → não exibe.
 *
 * Observação:
 *
 * Esta função considera apenas a política de reapresentação do
 * convite.
 *
 * Ela NÃO verifica:
 *
 * - se o navegador suporta instalação;
 * - se o aplicativo já está instalado;
 * - se existe um evento beforeinstallprompt disponível.
 *
 * Essas responsabilidades pertencem ao hook usePWAInstall().
 */
export function canShowInstallPrompt(): boolean {
  const dismissedAt = getInstallPromptDismissedAt();

  if (!dismissedAt) {
    return true;
  }

  const dismissedTime = new Date(dismissedAt).getTime();

  const elapsedTime = Date.now() - dismissedTime;

  const elapsedDays =
    elapsedTime / (1000 * 60 * 60 * 24);

  return elapsedDays >= DISMISS_PERIOD_IN_DAYS;
}