import { Check } from "lucide-react";

/**
 * Tipos visuais disponíveis para o card.
 */
type Variant = "info" | "warning" | "emotion" | "relax";

/**
 * Props do ReminderItemCard.
 */
type Props = {
  title: string;
  description: string;
  time: string;
  variant: Variant;
  onAccept: () => void;
  onPostpone: () => void;
  status: "pending" | "accepted" | "postponed";
};

/**
 * Mapeamento de estilos por tipo de lembrete.
 */
const variantStyles = {
  info: "bg-blue-50 border-blue-200",
  warning: "bg-orange-50 border-orange-200",
  emotion: "bg-pink-50 border-pink-200",
  relax: "bg-purple-50 border-purple-200",
};

/**
 * Card que representa uma sugestão de lembrete.
 *
 * Contém:
 * - título
 * - descrição
 * - horário sugerido
 * - ações (aceitar / adiar)
 */
export default function ReminderItemCard({
  title, 
  description,
  time,
  variant,
  onAccept,
  onPostpone,
  status,
}: Props) {
  return (
    <div
      className={`rounded-2xl p-4 shadow-sm border ${variantStyles[variant]}`}
    >
      {/* Conteúdo */}
      <div className="mb-3">
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="mt-1 text-xs text-gray-400">{time}</p>
      </div>

      {/* Ações */}
      <div className="flex gap-3">
      <button
        onClick={onAccept}
        disabled={status === "accepted"}
        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-white ${
          status === "accepted"
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#008236]"
        }`}
      >
        <Check size={16} />
        {status === "accepted" ? "Aceito" : "Aceitar"}
      </button>

      <button
        onClick={onPostpone}
        className="rounded-xl bg-gray-200 px-4 py-2 text-sm text-gray-700"
      >
        Mais tarde
      </button>
      </div>
    </div>
  );
}