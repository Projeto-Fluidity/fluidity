import type { MoodType } from "./mood";

/**
 * Representa a frequência de registros
 * de humor por dia da semana.
 *
 * Utilizado para alimentar o gráfico semanal.
 */
export type WeeklyFrequency = {
  day: string;
  value: number;
};

/**
 * Estrutura agregada contendo métricas
 * analíticas derivadas do histórico de humor.
 */
export type MoodAnalytics = {
  weeklyFrequency: WeeklyFrequency[];
  weeklyAverage: number;
  bestDay: string | null;
  bestDayValue: number;
  dominantMood: MoodType | null;
  totalCheckins: number;
};
