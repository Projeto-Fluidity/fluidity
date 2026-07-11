import { Clock, Pencil, Trash2 } from "lucide-react";

import WeekDaySelector from "./WeekDaySelector";

import { WEEK_DAYS } from "../../constants/weekDays";

/**
 * ============================================================
 * PROPS
 * ============================================================
 */
type Props = {
  label: string;
  time: string;
  customDays: string[];

  canDelete?: boolean;

  /**
   * Define se a informação dos dias da semana
   * deverá ser ocultada.
   *
   * Utilizado em categorias que possuem um único
   * lembrete diário, como Humor.
   */
  hideDays?: boolean;

  /**
   * Disparado quando um dia da semana é
   * ativado ou desativado.
   *
   * Esta propriedade é opcional para manter
   * compatibilidade com telas que ainda não
   * implementaram essa funcionalidade.
   */
  onToggleDay?: (dayId: string) => void;

  /**
   * Abre o modal de edição.
   */
  onEdit: () => void;

  /**
   * Solicita a exclusão do lembrete.
   */
  onDelete: () => void;
};

/**
 * ============================================================
 * REMINDER CONFIG ITEM
 * ============================================================
 *
 * Card responsável por exibir um lembrete
 * configurado pelo usuário.
 *
 * Este componente possui apenas responsabilidades
 * de interface.
 *
 * Toda regra de negócio permanece na página
 * que o utiliza.
 */
export default function ReminderConfigItem({
  label,
  time,
  customDays,
  canDelete = true,
  hideDays = false,

  onToggleDay,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div
      className="rounded-2xl bg-white px-4 py-4"
      style={{
        border: "1.18px solid #B9F8CF",
        boxShadow:
          "0px 4px 14px rgba(0,0,0,0.08), 0px 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* ======================================================
          CABEÇALHO
        ====================================================== */}
      <div className="flex items-start justify-between gap-4">
        {/* Informações */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-800">
            {label}
          </p>

          <div className="mt-1 flex items-center gap-1">
            <Clock
              size={12}
              className="text-gray-500"
            />

            <span className="text-xs font-medium text-gray-600">
              {time}
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col items-center gap-2 pt-1">
          <button
            onClick={onEdit}
            aria-label="Editar lembrete"
            className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-gray-100"
          >
            <Pencil
              size={15}
              className="text-gray-600"
            />
          </button>

          {canDelete && (
            <button
              onClick={onDelete}
              aria-label="Excluir lembrete"
              className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-red-50"
            >
              <Trash2
                size={15}
                className="text-red-400"
              />
            </button>
          )}
        </div>
      </div>

      {/* ======================================================
          DIAS DA SEMANA
        ====================================================== */}
      {!hideDays && (
        <div className="mt-4">
          <WeekDaySelector
            weekDays={WEEK_DAYS}
            selectedDays={customDays}
            onToggleDay={onToggleDay ?? (() => {})}
          />
        </div>
      )}
    </div>
  );
}
