import { useState } from "react";

import { usePWAInstall } from "../../hooks/usePWAInstall";

import { markInstallPromptDismissed } from "../../storage/pwaInstallPromptStorage";

/**
 * ============================================================
 * INSTALL APP CARD
 * ============================================================
 *
 * Responsável por:
 *
 * - exibir convite de instalação do PWA;
 * - disparar o prompt nativo;
 * - registrar quando o usuário já visualizou;
 * - evitar exibições repetidas.
 *
 * Importante:
 *
 * Este componente não conhece:
 *
 * - Emotion;
 * - Mood;
 * - Auth;
 * - Navegação.
 *
 * Este componente permanece responsável
 * apenas pela renderização da interface.
 *
 * A decisão sobre quando o convite deve
 * ser exibido permanece centralizada
 * no Hook usePWAInstall().
 */
export default function InstallAppCard() {
  /**
   * ==========================================================
   * LOCAL STATE
   * ==========================================================
   *
   * Controla apenas a remoção imediata
   * do card durante o ciclo de vida
   * do componente.
   *
   * Não representa persistência.
   */
  const [dismissed, setDismissed] = useState(false);

  /** ==========================================================
   * PWA INSTALL
   * ==========================================================
   */
  const { shouldShowInstallPrompt, install } = usePWAInstall();

  if (!shouldShowInstallPrompt || dismissed) {
    return null;
  }

  /** ==========================================================
   * DISPENSAR CONVITE
   * ==========================================================
   */

  function handleDismiss() {
    markInstallPromptDismissed();
    setDismissed(true);
  }

  /**
   * Dispara o prompt nativo de instalação.
   *
   * A decisão do navegador permanece
   * encapsulada no Hook usePWAInstall().
   */
  async function handleInstall() {
    await install();
  }

  /**  ==========================================================
   * RENDERIZAÇÃO
   * ==========================================================
   */

  return (
    <section className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-[#1E2939]">
          Leve o Fluidity com você
        </h2>

        <p className="text-sm text-gray-600">
          Adicione o Fluidity à sua tela inicial para acessar suas práticas e
          acompanhar seu bem-estar com mais facilidade.
        </p>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleInstall}
          className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-medium text-white transition hover:bg-green-700"
        >
          Adicionar à tela inicial
        </button>

        <button
          onClick={handleDismiss}
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          Agora não
        </button>
      </div>
    </section>
  );
}
