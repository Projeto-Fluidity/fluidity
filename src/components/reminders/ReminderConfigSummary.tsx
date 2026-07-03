import { Bell } from "lucide-react";

/**
 * ============================================================
 * PROPS
 * ============================================================
 */
type Props = {
  /**
   * Título exibido no card.
   *
   * Exemplo:
   *
   * - Lembrete diário
   * - 3 lembretes ativos
   */
  title: string;

  /**
   * Texto complementar exibido abaixo do título.
   */
  description: string;
};

/**
 * Card de resumo exibindo o total de lembretes ativos.
 */
export default function ReminderConfigSummary({ 
    title,
    description, 
  }: Props) 
  {
  return (
    <div
      className="rounded-2xl bg-white px-5 py-4 flex items-center gap-4"
      style={{
        border: "1.18px solid #B9F8CF",
        boxShadow: "0px 4px 14px rgba(0,0,0,0.08), 0px 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <Bell size={22} style={{ color: "#008236" }} />
      </div>
      
      <div className="flex-1">
        <p className="text-lg font-semibold text-gray-800">
          {title}
        </p>

        <p className="text-sm text-slate-500 leading-5">
          {description}
        </p>
      </div>
    </div>
  );
}
