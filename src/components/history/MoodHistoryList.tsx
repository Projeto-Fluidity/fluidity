import { getMoodDefinition } from "../../lib/moods";
import { formatDate } from "../../lib/date";
import type { MoodRecord } from "../../types/moodRecord";

/**
 * Props esperadas pelo componente MoodHistoryList.
 */
type Props = {
  history: MoodRecord[];
  loading: boolean;
};

/**
 * Componente responsável por exibir
 * o histórico de registros de humor do usuário.
 *
 * O layout segue o design definido no Figma,
 * exibindo emoji, humor, data e horário do registro.
 */
export default function MoodHistoryList({ history, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.10)]">
        <p className="text-sm text-gray-500">Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.10)]">
      {/* Título da seção */}
      <h2 className="mb-4 text-[20px] font-semibold text-[#1E2939]">
        Histórico de Humor
      </h2>

      <div>
        {history.map((record, index) => {
          const moodInfo = getMoodDefinition(record.mood);

          const time = new Date(record.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={record.id}
              className={`flex items-center justify-between py-3 ${
                index !== history.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              {/* Lado esquerdo */}
              <div className="flex items-center gap-3">
                {/* Emoji */}
                <div className="flex h-10 w-10 items-center justify-center text-2xl">
                  {moodInfo?.emoji}
                </div>

                {/* Texto */}
                <div>
                  <p className="text-[16px] font-semibold text-[#1E2939]">
                    {moodInfo?.label}
                  </p>

                  <p className="text-sm text-gray-500">
                    {formatDate(record.created_at)}
                  </p>
                </div>
              </div>

              {/* Hora */}
              <span className="text-sm text-gray-500">{time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
