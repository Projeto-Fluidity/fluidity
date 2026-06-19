import type { MoodType } from "./mood";

/**
 * Representa um registro de humor salvo no banco.
 */
export type MoodRecord = {
  id: string;

  /**
   * Proprietário do registro.
   *
   * Utilizado para garantir isolamento
   * entre usuários no mesmo dispositivo.
   */
  user_id?: string;

  mood: MoodType;

  /**
   * Data do check-in.
   *
   * Presente no modo API e passará a ser
   * utilizada também pelos modos locais.
   */
  checkin_date?: string;

  created_at: string;
};
