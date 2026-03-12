/**
 * Componente responsável por exibir
 * o gráfico semanal de humor.
 */
export default function WeeklyChart() {
  const data = [
    { day: "Seg", value: 60 },
    { day: "Ter", value: 70 },
    { day: "Qua", value: 80 },
    { day: "Qui", value: 95 },
    { day: "Sex", value: 85 },
    { day: "Sáb", value: 60 },
    { day: "Dom", value: 50 },
  ];

  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm">

      <h2 className="font-semibold text-gray-800 mb-4">
        Gráfico semanal
      </h2>

      <div className="flex items-end justify-between h-32 mb-4">

        {data.map((item) => (
          <div key={item.day} className="flex flex-col items-center">

            <div
              className="bg-green-400 rounded-md w-6"
              style={{ height: `${item.value}%` }}
            />

            <span className="text-xs text-gray-500 mt-2">
              {item.day}
            </span>

          </div>
        ))}

      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p>Média semanal <strong>77%</strong></p>
        <p>Melhor dia <span className="text-green-600">Quinta-feira (95%)</span></p>
        <p>Total de check-ins <strong>7 dias</strong></p>
        <p>Humor predominante 🙂 Feliz</p>
      </div>

    </div>
  );
}
