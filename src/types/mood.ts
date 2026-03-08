/**
 * Tipos possíveis de humor registrados pelo usuário.
 *
 * Esses valores são utilizados tanto na interface
 * quanto na persistência no banco de dados.
 */
export type MoodType = "very_happy" | "happy" | "neutral" | "sad" | "very_sad";

/**
 * Representa um registro de humor armazenado no sistema.
 */
export interface Mood {
  /** Identificador único do registro */
  id: string;

  /** Identificador do usuário que registrou o humor */
  user_id: string;

  /** Tipo de humor registrado */
  mood: MoodType;

  /** Nota opcional associada ao humor */
  note?: string;

  /** Data e hora em que o registro foi criado */
  created_at: string;
}
