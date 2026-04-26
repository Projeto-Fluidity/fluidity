import { Clock, Pencil, Trash2 } from "lucide-react";

type Props = {
  label: string;
  time: string;
  customDays: string[];
  active: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

/**
 * Card individual de lembrete configurado.
 *
 * Exibe nome e horario.
 * Permite editar via lapis, excluir via lixeira e ativar/desativar via toggle.
 */
export default function ReminderConfigItem({
  label,
  time,
  customDays: _customDays,
  active,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div
      className="rounded-2xl bg-white px-4 py-4"
      style={{
        border: "1.18px solid #B9F8CF",
        boxShadow: "0px 4px 14px rgba(0,0,0,0.08), 0px 1px 4px rgba(0,0,0,0.04)",
        opacity: active ? 1 : 0.6,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800">{label}</p>
          <div className="flex items-center gap-1 mt-1">
            <Clock size={12} className="text-gray-500" />
            <span className="text-xs font-medium text-gray-600">{time}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Lapis */}
          <button
            onClick={onEdit}
            aria-label="Editar lembrete"
            className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-gray-100"
          >
            <Pencil size={15} className="text-gray-600" />
          </button>

          {/* Lixeira */}
          <button
            onClick={onDelete}
            aria-label="Excluir lembrete"
            className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-red-50"
          >
            <Trash2 size={15} className="text-red-400" />
          </button>

          {/* Toggle */}
          <button
            onClick={onToggle}
            aria-pressed={active}
            className="relative h-7 w-12 rounded-full transition-colors duration-300 focus:outline-none"
            style={{ backgroundColor: active ? "#008236" : "#D1D5DB" }}
          >
            <div
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                active ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}