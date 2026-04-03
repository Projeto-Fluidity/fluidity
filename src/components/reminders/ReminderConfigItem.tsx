import { Clock, Trash2 } from "lucide-react";
import Toggle from "../ui/Toggle";
import type { FrequencyConfig } from "./ReminderConfigForm";

/**
 * Mapeamento dos ids para os nomes abreviados dos dias.
 */
const DAY_LABELS: Record<string, string> = {
  seg: "Seg",
  ter: "Ter",
  qua: "Qua",
  qui: "Qui",
  sex: "Sex",
  sab: "Sab",
  dom: "Dom",
};

/**
 * Retorna os dias selecionados formatados para exibicao.
 * Quando todos os 7 dias estao selecionados, exibe "Todos os dias".
 */
function formatDays(frequency: FrequencyConfig): string {
  if (frequency.customDays.length === 7) return "Todos os dias";
  return frequency.customDays.map((d) => DAY_LABELS[d] ?? d).join(", ");
}

/**
 * Props do componente ReminderConfigItem.
 */
type ReminderConfigItemProps = {
  label: string;
  time: string;
  frequency: FrequencyConfig;
  active: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

/**
 * Componente que renderiza um item individual
 * na lista de lembretes configurados pelo usuario.
 *
 * Exibe o nome, horario, dias da semana selecionados
 * e acoes de ativacao e exclusao.
 */
export default function ReminderConfigItem({
  label,
  time,
  frequency,
  active,
  onToggle,
  onDelete,
}: ReminderConfigItemProps) {
  return (
    <div
      className="rounded-2xl bg-white px-4 py-3 transition-opacity"
      style={{
        border: "1.18px solid #B9F8CF",
        boxShadow: "0px 4px 14px rgba(0,0,0,0.08), 0px 1px 4px rgba(0,0,0,0.04)",
        opacity: active ? 1 : 0.5,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Informacoes do lembrete */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{label}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={11} />
              {time}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-400">{formatDays(frequency)}</p>
        </div>

        {/* Acoes */}
        <div className="flex items-center gap-3 pt-0.5">
          <button
            onClick={onDelete}
            aria-label="Excluir lembrete"
            className="flex h-8 w-8 items-center justify-center rounded-full text-red-400 hover:bg-red-50 transition"
          >
            <Trash2 size={15} />
          </button>
          <Toggle active={active} onToggle={onToggle} />
        </div>
      </div>
    </div>
  );
}