import { Bell, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Card de navegacao para a tela de configuracao de lembretes.
 */
export default function ReminderNavigationCard() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/reminder-config")}
      className="group flex items-center justify-between rounded-2xl px-5 py-4 cursor-pointer shadow-sm transition-all duration-200 hover:shadow-md bg-gradient-to-r from-[#00A63E] to-[#008236] text-white"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <Bell size={18} />
        </div>
        <div>
          <p className="font-medium">Lembretes Inteligentes</p>
          <p className="text-sm opacity-80">Configure suas notificacoes</p>
        </div>
      </div>
      <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
    </div>
  );
}