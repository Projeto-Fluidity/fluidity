import type { MoodRecord } from "../types/moodRecord";

/**
 * Mapa responsável por associar cada humor
 * ao emoji correspondente.
 */
const moodEmoji: Record<string, string> = {
  happy: "🙂",
  excited: "😄",
  tired: "😴",
  angry: "😡",
  sad: "😢",
  anxious: "😟",
};

/**
 * Componente responsável por exibir
 * o histórico de humor do usuário.
 */
type MoodHistoryProps = {
  records: MoodRecord[];
};

export default function MoodHistory({ records }: MoodHistoryProps) {
  if (records.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-gray-500">Nenhum registro encontrado.</p>
      </div>
    );
  }

  const latest = records[0];
  const history = records.slice(1);

  return (
    <div className="space-y-4">
      {/* Último check-in */}
      <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{moodEmoji[latest.mood] ?? "🙂"}</div>

          <div>
            <p className="text-sm text-gray-500">Último check-in</p>
            <p className="font-medium capitalize text-gray-800">
              {latest.mood}
            </p>
          </div>
        </div>

        <span className="text-sm text-gray-400">
          {new Date(latest.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Histórico completo */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-gray-800">Histórico de Humor</h3>

        <ul className="space-y-3">
          {history.map((record) => (
            <li key={record.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {moodEmoji[record.mood] ?? "🙂"}
                </span>

                <div>
                  <p className="font-medium capitalize text-gray-800">
                    {record.mood}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(record.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <span className="text-sm text-gray-400">
                {new Date(record.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
