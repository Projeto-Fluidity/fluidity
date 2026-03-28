/**
 * Representa um lembrete exibido ao usuário
 */
export type Reminder = {
  id: string;
  title: string;
  description: string;
  time: string;

  /**
   * Variante visual do card
   */
  variant: "emotion" | "warning" | "info" | "relax";

  /**
   * Estado atual do lembrete
   */
  status: "pending" | "accepted" | "postponed";

  /**
   * Data da última interação do usuário
   *
   * Regras:
   * - Se for igual a hoje → NÃO mostrar
   * - Se for diferente → mostrar
   */
  last_interaction_date: string | null;
};
