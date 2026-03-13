import { getMoodDefinition } from "../../lib/moods";
import { formatTime } from "../../lib/date";
import type { MoodRecord } from "../../types/moodRecord";

/**
 * Props do componente LastCheckinCard.
 */
type Props = {
  record: MoodRecord;
};

/**
 * Card responsável por exibir
 * o último check-in realizado pelo usuário.
 *
 * O layout segue o design definido
 * no Figma da aplicação Fluidity.
 */
export default function LastCheckinCard({ record }: Props) {

  const moodInfo = getMoodDefinition(record.mood);

  return (
    <div className="bg-white rounded-3xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.10)]">

      <div className="flex items-center justify-between">

        {/* Lado esquerdo */}
        <div className="flex items-center gap-3">

          {/* Emoji */}
          <div className="w-10 h-10 flex items-center justify-center text-2xl">
            {moodInfo?.emoji}
          </div>

          {/* Texto */}
          <div>

            <p className="text-sm text-gray-500">
              Último check-in
            </p>

            <p className="text-[16px] font-semibold text-[#1E2939]">
              {moodInfo?.label}
            </p>

          </div>

        </div>

        {/* Hora */}
        <span className="text-sm text-gray-500">
          {formatTime(record.created_at)}
        </span>

      </div>

    </div>
  );
}
