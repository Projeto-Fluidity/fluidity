import { Bell } from "lucide-react";

type ReminderConfigSummaryProps = {
  activeCount: number;
};

/**
 * Exibe um resumo com o total de lembretes
 * ativos configurados pelo usuario.
 */
export default function ReminderConfigSummary({
  activeCount,
}: ReminderConfigSummaryProps) {
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
        <p className="text-lg font-bold text-gray-800">
          {activeCount}{" "}
          <span className="text-sm font-normal text-gray-500">
            {activeCount === 1 ? "lembrete ativo" : "lembretes ativos"}
          </span>
        </p>
        <p className="text-xs text-gray-400">
          Voce pode adicionar ate 10 lembretes por dia
        </p>
      </div>
    </div>
  );
}