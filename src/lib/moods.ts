import type { MoodType } from "../types/mood";

/**
 * Estrutura que representa um humor disponível na aplicação.
 */
export type MoodDefinition = {
  value: MoodType;
  emoji: string;
  label: string;
};

/**
 * Dicionário central de humores do sistema.
 *
 * Esse objeto funciona como a fonte única de verdade
 * para representar estados emocionais na aplicação.
 */
export const moods: MoodDefinition[] = [
  {
    value: "happy",
    emoji: "🙂",
    label: "Feliz",
  },
  {
    value: "sad",
    emoji: "😢",
    label: "Triste",
  },
  {
    value: "tired",
    emoji: "😴",
    label: "Cansado",
  },
  {
    value: "excited",
    emoji: "😄",
    label: "Entusiasmado",
  },
  {
    value: "angry",
    emoji: "😡",
    label: "Irritado",
  },
  {
    value: "anxious",
    emoji: "😟",
    label: "Ansioso",
  },
];

/**
 * Função utilitária para recuperar
 * a definição completa de um humor.
 *
 * @param mood valor armazenado no banco
 * @returns objeto com emoji e label
 */
export function getMoodDefinition(mood: MoodType) {
  return moods.find((m) => m.value === mood);
}
