import type { WeeklyFrequency } from "../../types/analytics";
import type { MoodType } from "../../types/mood";

/**
 * Propriedades esperadas pelo componente WeeklyChart.
 *
 * Este componente recebe dados já calculados pela camada
 * de analytics e é responsável apenas por renderizar
 * o gráfico semanal e as métricas associadas.
 */
type WeeklyChartProps = {
  data: WeeklyFrequency[];
  weeklyAverage: number;
  bestDay: string | null;
  bestDayValue: number;
  dominantMood: MoodType | null;
  totalCheckins: number;
};

/**
 * Componente responsável por exibir
 * o gráfico semanal de humor.
 *
 * Este componente é puramente visual e
 * não contém lógica de negócio.
 */
export default function WeeklyChart({
  data,
  weeklyAverage,
  bestDay,
  bestDayValue,
  dominantMood,
  totalCheckins,
}: WeeklyChartProps) {

  /**
   * Calcula o maior valor da semana para normalizar
   * a altura das barras em percentual.
   */
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const normalizedData = data.map((item) => ({
    ...item,
    percent: Math.round((item.value / maxValue) * 100),
  }));

  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm">

      <h2 className="font-semibold text-gray-800 mb-4">
        Gráfico semanal
      </h2>

      {/* Gráfico */}
      <div className="flex items-end justify-between h-32 mb-4">

        {normalizedData.map((item) => (
          <div
            key={item.day}
            className="flex flex-col items-center"
          >

            <div
              className="bg-green-400 rounded-md w-6 transition-all"
              style={{
                height: `${item.percent}%`,
              }}
            />

            <span className="text-xs text-gray-500 mt-2">
              {item.day}
            </span>

          </div>
        ))}

      </div>

      {/* Métricas */}
      <div className="text-sm text-gray-600 space-y-1">

        <p>
          Média semanal{" "}
          <strong>
            {weeklyAverage}%
          </strong>
        </p>

        <p>
          Melhor dia{" "}
          <span className="text-green-600">
            {bestDay ?? "-"} ({bestDayValue}%)
          </span>
        </p>

        <p>
          Total de check-ins{" "}
          <strong>
            {totalCheckins} dias
          </strong>
        </p>

        <p>
          Humor predominante{" "}
          <strong>
            {dominantMood ?? "-"}
          </strong>
        </p>

      </div>

    </div>
  );
}
