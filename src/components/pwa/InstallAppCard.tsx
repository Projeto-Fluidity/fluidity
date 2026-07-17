import { useState } from "react";

import { usePWAInstall } from "../../hooks/usePWAInstall";

import {
  hasDismissedInstallPrompt,
  markInstallPromptDismissed,
} from "../../storage/pwaInstallPromptStorage";

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
 * Toda a lógica de exibição da tela
 * permanece responsabilidade da página.
 */
export default function InstallAppCard() {
  /**
   * ==========================================================
   * PWA INSTALL
   * ==========================================================
   */
  const { canInstall, install } = usePWAInstall();

  /**
   * ==========================================================
   * LOCAL STATE
   * ==========================================================
   *
   * Controla remoção imediata do card
   * sem depender de re-render externo.
   */
  const [dismissed, setDismissed] = useState(false);

  /**
   * ==========================================================
   * REGRAS DE EXIBIÇÃO
   * ==========================================================
   *
   * Centraliza todas as condições que determinam
   * se o convite de instalação deve ser renderizado.
   *
   * Manter essa decisão em um único ponto facilita
   * futuras evoluções da regra de negócio sem
   * espalhar condicionais pelo componente.
   */
  function shouldRenderCard(): boolean {
    return (
      canInstall &&
      !dismissed &&
      !hasDismissedInstallPrompt() 
    );
  }

  /**
   * ==========================================================
   * GUARD
   * ==========================================================
   *
   * Interrompe a renderização quando o convite
   * não deve ser exibido.
   */
  if (!shouldRenderCard()) {
    return null;
  }

  /**
   * ==========================================================
   * DISPENSAR CONVITE
   * ==========================================================
   *
   * Remove imediatamente o card da interface.
   *
   * Nesta etapa o estado é apenas visual.
   * A persistência será tratada posteriormente.
   */

  function handleDismiss() {
    markInstallPromptDismissed();
    setDismissed(true);
  }

  /**
   * ==========================================================
   * INSTALAÇÃO
   * ==========================================================
   *
   * Dispara o prompt nativo do navegador.
   *
   * Caso o usuário aceite a instalação,
   * o convite é marcado como dispensado
   * para evitar novas exibições.
   *
   * A detecção da instalação permanece
   * responsabilidade do navegador.
   */
  async function handleInstall() {
    const result = await install();

    if (result === "accepted") {
      markInstallPromptDismissed();
    }

    setDismissed(true);
  }

  /**
   * ==========================================================
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
