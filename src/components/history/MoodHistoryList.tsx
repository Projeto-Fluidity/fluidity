import { getMoodDefinition } from "../../lib/moods";
import { formatDate } from "../../lib/date";
import type { MoodRecord } from "../../types/moodRecord";

/**
 * Lista de registros de humor do usuário.
 */
type Props = {
  history: MoodRecord[];
  loading: boolean;
};

export default function MoodHistoryList({ history, loading }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm">

      <h2 className="font-semibold text-gray-800 mb-3">
        Histórico de Humor
      </h2>

      {loading && (
        <p className="text-gray-500">
          Carregando histórico...
        </p>
      )}

      {!loading && history.map((record) => {
        const moodInfo = getMoodDefinition(record.mood);

        return (
          <div
            key={record.id}
            className="flex justify-between py-2 border-b last:border-none"
          >
            <span className="text-gray-700">
              {moodInfo?.emoji} {moodInfo?.label}
            </span>

            <span className="text-sm text-gray-500">
              {formatDate(record.created_at)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
