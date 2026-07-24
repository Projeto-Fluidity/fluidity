import { createContext } from "react";

/**
 * ============================================================
 * PWA INSTALL CONTEXT VALUE
 * ============================================================
 *
 * Define a API pública disponibilizada pelo
 * PWAInstallProvider para toda a aplicação.
 *
 * Este contrato expõe apenas as informações
 * necessárias para que outros componentes
 * possam solicitar a instalação do PWA.
 *
 * Detalhes internos, como o evento
 * beforeinstallprompt, permanecem encapsulados
 * no Provider.
 */
export type PWAInstallContextValue = {
  /**
   * Indica se o navegador permite iniciar
   * a instalação do Progressive Web App.
   */
  canInstall: boolean;

  /**
   * Solicita ao navegador a instalação
   * do Progressive Web App.
   *
   * Retorna:
   *
   * - accepted: usuário aceitou instalar;
   * - dismissed: usuário recusou instalar;
   * - null: instalação indisponível.
   */
  install: () => Promise<"accepted" | "dismissed" | null>;
};

/**
 * ============================================================
 * PWA INSTALL CONTEXT
 * ============================================================
 *
 * Contexto global responsável por disponibilizar
 * informações relacionadas ao fluxo de instalação
 * do Progressive Web App.
 *
 * O contexto é consumido através do Hook:
 *
 * usePWAInstall()
 */
export const PWAInstallContext = createContext<PWAInstallContextValue | null>(
  null,
);
