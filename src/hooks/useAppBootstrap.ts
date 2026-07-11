import { useEffect } from "react";

import { bootstrapNotifications } from "../services/notificationBootstrapService";

import { useAuth } from "./useAuth";

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
   * AUTH
   * ==========================================================
   *
   * Recupera o usuário autenticado.
   *
   * O bootstrap depende do identificador do usuário para
   * sincronizar corretamente a infraestrutura de notificações.
   */
  const { user } = useAuth();

  /**
   * ==========================================================
   * EFFECT
   * ==========================================================
   *
   * Executa o bootstrap sempre que um usuário autenticado
   * estiver disponível.
   *
   * Isso garante que:
   *
   * - o bootstrap não execute antes da autenticação;
   * - logout/login sincronize corretamente o novo usuário;
   * - a infraestrutura de notificações permaneça consistente.
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    const currentUser = user;

    async function initialize() {
      try {
        await bootstrapNotifications(currentUser.id);
      } catch (error) {
        console.error("Erro durante bootstrap da aplicação:", error);
      }
    }

    void initialize();
  }, [user]);
}
