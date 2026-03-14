import type { MoodType } from "./mood";

/**
 * Representa um registro de humor salvo no banco.
 */
export type MoodRecord = {
  id: string;
  mood: MoodType;
  created_at: string;
};
