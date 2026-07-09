import { useEffect } from "react";

import { bootstrapNotifications } from "../services/notificationBootstrapService";

/**
 * ============================================================
 * APP BOOTSTRAP
 * ============================================================
 *
 * Responsável por inicializar serviços globais da aplicação.
 *
 * Este hook concentra todos os processos executados durante
 * a inicialização do aplicativo.
 *
 * Atualmente:
 *
 * - sincronização da infraestrutura de notificações.
 *
 * Futuramente:
 *
 * - bootstrap de lembretes;
 * - sincronização offline;
 * - feature flags;
 * - analytics;
 * - cache;
 * - outros serviços globais.
 */
export function useAppBootstrap() {
  /**
   * ==========================================================
   * EFFECT
   * ==========================================================
   */

  useEffect(() => {
    /**
     * ========================================================
     * INITIALIZE APPLICATION
     * ========================================================
     */

    async function initialize() {
      try {
        await bootstrapNotifications();
      } catch (error) {
        console.error(
          "Erro durante bootstrap da aplicação:",
          error,
        );
      }
    }

    void initialize();
  }, []);
}
