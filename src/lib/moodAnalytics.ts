import type { MoodRecord } from "../types/moodRecord";
import type { MoodType } from "../types/mood";
import type { WeeklyFrequency, MoodAnalytics } from "../types/analytics";


const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/**
 * Calcula a frequência de registros por dia da semana.
 *
 * @param history Lista de registros de humor
 * @returns Distribuição semanal de registros
 */
export function getWeeklyFrequency(
  history: MoodRecord[]
): WeeklyFrequency[] {
  const counts = Array(7).fill(0);

  for (const record of history) {
    const date = new Date(record.created_at);
    const dayIndex = date.getDay();
    counts[dayIndex]++;
  }

  return WEEK_DAYS.map((day, index) => ({
    day,
    value: counts[index],
  }));
}

/**
 * Calcula a média semanal de registros.
 *
 * @param history Lista de registros de humor
 * @returns média semanal de check-ins
 */
export function getWeeklyAverage(
  history: MoodRecord[]
): number {
  if (history.length === 0) {
    return 0;
  }

  const weeks = new Set(
    history.map((record) => {
      const date = new Date(record.created_at);
      const year = date.getFullYear();
      const week = getWeekNumber(date);
      return `${year}-${week}`;
    })
  );

  return Number((history.length / weeks.size).toFixed(2));
}

/**
 * Retorna o dia da semana com maior frequência de registros.
 *
 * @param history Lista de registros de humor
 * @returns dia e valor de frequência
 */
export function getBestDay(
  history: MoodRecord[]
): { day: string | null; value: number } {
  const frequency = getWeeklyFrequency(history);

  const best = frequency.reduce((prev, current) =>
    current.value > prev.value ? current : prev
  );

  if (best.value === 0) {
    return { day: null, value: 0 };
  }

  return {
    day: best.day,
    value: best.value,
  };
}

/**
 * Identifica o humor predominante
 * entre todos os registros.
 *
 * @param history Lista de registros de humor
 * @returns tipo de humor predominante
 */
export function getDominantMood(
  history: MoodRecord[]
): MoodType | null {
  if (history.length === 0) {
    return null;
  }

  const counts: Record<MoodType, number> = {
    happy: 0,
    sad: 0,
    tired: 0,
    excited: 0,
    angry: 0,
    anxious: 0,
  };

  for (const record of history) {
    counts[record.mood]++;
  }

  const dominant = Object.entries(counts).reduce(
    (prev, current) =>
      current[1] > prev[1] ? current : prev
  );

  return dominant[0] as MoodType;
}

/**
 * Função agregadora responsável por gerar
 * todas as métricas analíticas do histórico.
 *
 * @param history Lista de registros de humor
 * @returns objeto contendo métricas derivadas
 */
export function getMoodAnalytics(
  history: MoodRecord[]
): MoodAnalytics {
  const weeklyFrequency = getWeeklyFrequency(history);
  const bestDay = getBestDay(history);

  return {
    weeklyFrequency,
    weeklyAverage: getWeeklyAverage(history),
    bestDay: bestDay.day,
    bestDayValue: bestDay.value,
    dominantMood: getDominantMood(history),
    totalCheckins: history.length,
  };
}

/**
 * Calcula o número da semana no ano.
 */
function getWeekNumber(date: Date): number {
  const firstDay = new Date(date.getFullYear(), 0, 1);

  const pastDays =
    (date.getTime() - firstDay.getTime()) / 86400000;

  return Math.ceil(
    (pastDays + firstDay.getDay() + 1) / 7
  );
}
