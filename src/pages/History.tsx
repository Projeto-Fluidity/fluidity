import AppLayout from "../components/layout/AppLayout";
import { useMood } from "../hooks/useMood";
import LastCheckinCard from "../components/history/LastCheckinCard";
import MoodHistoryList from "../components/history/MoodHistoryList";
import WeeklyChart from "../components/history/WeeklyChart";

/**
 * Tela responsável por exibir
 * o histórico de humor do usuário.
 */
export default function History() {
  const { history, loading } = useMood();

  const lastCheckin = history[0];

  return (
    <AppLayout>
      <div className="space-y-6">

        <h1 className="text-2xl font-semibold text-gray-800">
          Histórico de Hoje
        </h1>

        {lastCheckin && (
          <LastCheckinCard record={lastCheckin} />
        )}

        <MoodHistoryList
          history={history}
          loading={loading}
        />
        
        <WeeklyChart />

      </div>
    </AppLayout>
  );
}
