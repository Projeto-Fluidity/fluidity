import { useMemo } from "react";

import type { MoodRecord } from "../types/moodRecord";
import type { MoodAnalytics } from "../types/analytics";

import { getMoodAnalytics } from "../lib/moodAnalytics";

/**
 * Hook responsável por derivar métricas analíticas
 * a partir do histórico de humor do usuário.
 *
 * O uso de useMemo garante que os cálculos
 * só sejam executados quando o histórico mudar.
 *
 * @param history Lista de registros de humor
 * @returns métricas analíticas derivadas
 */
export function useMoodAnalytics(
  history: MoodRecord[]
): MoodAnalytics {

  const analytics = useMemo(() => {
    return getMoodAnalytics(history);
  }, [history]);

  return analytics;
}
