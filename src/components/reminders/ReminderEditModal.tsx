import { X } from "lucide-react";

/**
 * ============================================================
 * TYPES
 * ============================================================
 */

/**
 * Representa um dia da semana exibido no seletor.
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
 * Este componente é totalmente visual.
 *
 * Ele NÃO conhece:
 *
 * - banco de dados;
 * - Supabase;
 * - services;
 * - regras de negócio;
 * - lembretes.
 *
 * Toda a lógica permanece na página que o utiliza.
 */
type Props = {
  /**
   * Controla a abertura do modal.
   */
  open: boolean;

  /**
   * Título exibido no topo do modal.
   */
  title: string;

  /**
   * Horário atualmente selecionado.
   */
  time: string;

  /**
   * Dias atualmente selecionados.
   */
  days: string[];

  /**
   * Lista de dias disponíveis para seleção.
   */
  weekDays: WeekDay[];

  /**
   * Disparado quando o usuário altera o horário.
   */
  onTimeChange: (value: string) => void;

  /**
   * Disparado quando um dia da semana é selecionado.
   */
  onDayToggle: (dayId: string) => void;

  /**
   * Disparado ao salvar a configuração.
   */
  onSave: () => void;

  /**
   * Fecha o modal.
   */
  onClose: () => void;
};

/**
 * ============================================================
 * REMINDER EDIT MODAL
 * ============================================================
 *
 * Responsável apenas pela interface de edição
 * de um lembrete.
 *
 * Este componente não possui estado próprio e
 * não executa qualquer regra de negócio.
 *
 * Todo o estado é controlado pela página que
 * renderiza este componente.
 */
export default function ReminderEditModal({
  open,
  title,
  time,
  days,
  weekDays,
  onTimeChange,
  onDayToggle,
  onSave,
  onClose,
}: Props) {
  /**
   * ==========================================================
   * MODAL FECHADO
   * ==========================================================
   *
   * Quando "open" for falso, nada é renderizado.
   */
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* ======================================================
          BACKDROP
         ====================================================== */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ======================================================
          MODAL
         ====================================================== */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white px-6 py-6 shadow-xl space-y-5">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
        >
          <X size={14} />
        </button>

        {/* Título */}
        <p className="text-base font-semibold text-gray-800">
          {title}
        </p>

        {/* Campo de horário */}
        <input
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="border rounded-xl p-2 w-full"
        />

        {/* Dias da semana */}
        <div className="flex gap-2 flex-wrap">
          {weekDays.map((day) => {
            const selected = days.includes(day.id);

            return (
              <button
                key={day.id}
                onClick={() => onDayToggle(day.id)}
                className={`px-3 py-2 rounded-full text-xs ${
                  selected
                    ? "bg-green-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {day.label}
              </button>
            );
          })}
        </div>

        {/* Ações */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border rounded-xl py-2"
          >
            Cancelar
          </button>

          <button
            onClick={onSave}
            className="flex-1 bg-green-600 text-white rounded-xl py-2"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
