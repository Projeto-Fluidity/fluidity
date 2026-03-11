import AppLayout from "../components/layout/AppLayout";
import { useMood } from "../hooks/useMood";

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

        {/* Último check-in */}
        {lastCheckin && (
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <p className="text-sm text-gray-500">
              Último check-in
            </p>

            <div className="flex justify-between items-center mt-2">
              <span className="font-medium text-gray-800">
                {lastCheckin.mood}
              </span>

              <span className="text-sm text-gray-500">
                {new Date(lastCheckin.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}

        {/* Histórico */}
        <div className="bg-white rounded-xl p-4 border shadow-sm">

          <h2 className="font-semibold text-gray-800 mb-3">
            Histórico de Humor
          </h2>

          {loading && (
            <p className="text-gray-500">
              Carregando histórico...
            </p>
          )}

          {!loading && history.map((record) => (
            <div
              key={record.id}
              className="flex justify-between py-2 border-b last:border-none"
            >
              <span className="text-gray-700">
                {record.mood}
              </span>

              <span className="text-sm text-gray-500">
                {new Date(record.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}

        </div>

      </div>
    </AppLayout>
  );
}
