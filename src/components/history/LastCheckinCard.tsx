import { getMoodDefinition } from "../../lib/moods";
import { formatTime } from "../../lib/date";
import type { MoodRecord } from "../../types/moodRecord";

/**
 * Exibe o último check-in registrado pelo usuário.
 */
type Props = {
  record: MoodRecord;
};

export default function LastCheckinCard({ record }: Props) {
  const moodInfo = getMoodDefinition(record.mood);

  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm">
      <p className="text-sm text-gray-500">
        Último check-in
      </p>

      <div className="flex justify-between items-center mt-2">
        <span className="font-medium text-gray-800">
          {moodInfo?.emoji} {moodInfo?.label}
        </span>

        <span className="text-sm text-gray-500">
          {formatTime(record.created_at)}
        </span>
      </div>
    </div>
  );
}
