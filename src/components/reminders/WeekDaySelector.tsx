/**
 * ============================================================
 * TYPES
 * ============================================================
 */

/**
 * Representa um dia da semana exibido pelo
 * seletor de dias.
 */
type WeekDay = {
  id: string;
  label: string;
};

/**
 * ============================================================
 * PROPS
 * ============================================================
 *
 * Este componente possui apenas responsabilidade
 * visual.
 *
 * Toda regra de negócio permanece na página
 * que o utiliza.
 */
type Props = {
  /**
   * Dias disponíveis para exibição.
   */
  weekDays: readonly WeekDay[];

  /**
   * Dias atualmente ativos.
   */
  selectedDays: string[];

  /**
   * Disparado quando um dia é selecionado
   * ou removido.
   */
  onToggleDay: (dayId: string) => void;

  /**
   * Permite desabilitar a interação.
   */
  disabled?: boolean;
};

/**
 * ============================================================
 * WEEK DAY SELECTOR
 * ============================================================
 *
 * Exibe os dias da semana permitindo que
 * cada um seja ativado ou desativado.
 *
 * Este componente não conhece:
 *
 * • Supabase
 * • Services
 * • Hooks
 * • Reminder
 *
 * Apenas renderiza a interface.
 */
export default function WeekDaySelector({
  weekDays,
  selectedDays,
  onToggleDay,
  disabled = false,
}: Props) {
return (
  <div className="mt-3 grid grid-cols-7 gap-1">
    {weekDays.map((day) => {
      const selected = selectedDays.includes(day.id);

      return (
        <button
          key={day.id}
          type="button"
          disabled={disabled}
          onClick={() => onToggleDay(day.id)}
          className={`w-full rounded-full py-1 text-xs font-medium transition ${
            selected
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-500"
          } ${
            disabled
              ? "cursor-default opacity-60"
              : ""
          }`}
        >
          {day.label}
        </button>
      );
    })}
  </div>
);
}
