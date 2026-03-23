/**
 * Exibe métricas resumidas de uso dos lembretes.
 *
 * Informações:
 * - quantidade ativa
 * - quantidade concluída
 * - taxa de conclusão
 */
export default function ReminderStatsCard() {
  return (
    <div className="grid grid-cols-3 rounded-2xl bg-white p-4 shadow-sm text-center">
      <div>
        <p className="text-xl font-semibold text-green-600">4</p>
        <p className="text-xs text-gray-500">Ativos</p>
      </div>

      <div>
        <p className="text-xl font-semibold text-gray-800">12</p>
        <p className="text-xs text-gray-500">Concluídos</p>
      </div>

      <div>
        <p className="text-xl font-semibold text-blue-600">85%</p>
        <p className="text-xs text-gray-500">Taxa</p>
      </div>
    </div>
  );
}