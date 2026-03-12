import AppLayout from "../components/layout/AppLayout";
import { useMood } from "../hooks/useMood";
import { useMoodAnalytics } from "../hooks/useMoodAnalytics";

import LastCheckinCard from "../components/history/LastCheckinCard";
import MoodHistoryList from "../components/history/MoodHistoryList";
import WeeklyChart from "../components/history/WeeklyChart";

/**
 * Tela responsável por exibir
 * o histórico de humor do usuário.
 *
 * A página conecta os dados retornados
 * pelo hook useMood com as métricas
 * derivadas pelo hook useMoodAnalytics.
 */
export default function History() {

  const { history, loading } = useMood();

  const analytics = useMoodAnalytics(history);

  const lastCheckin = history[0];

  return (
    <AppLayout>

      <div className="space-y-6">

        <h1 className="text-2xl font-semibold text-gray-800">
          Histórico de Humor
        </h1>

        {lastCheckin && (
          <LastCheckinCard record={lastCheckin} />
        )}

        <MoodHistoryList
          history={history}
          loading={loading}
        />

        <WeeklyChart
          data={analytics.weeklyFrequency}
          weeklyAverage={analytics.weeklyAverage}
          bestDay={analytics.bestDay}
          bestDayValue={analytics.bestDayValue}
          dominantMood={analytics.dominantMood}
          totalCheckins={analytics.totalCheckins}
        />

      </div>

    </AppLayout>
  );
}
