import { Bell, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Card de navegacao para a tela de configuracao de lembretes.
 */
export default function ReminderNavigationCard() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/smart-reminders")}
      className="
      group
      flex
      items-center
      justify-between
      rounded-2xl
      px-5
      py-4
      cursor-pointer
      transition-all
      duration-200
      hover:shadow-md
      text-white
      "
      style={{
        background: "linear-gradient(90deg, #00A63E 0%, #008236 100%)",
        boxShadow:
          "0px 4px 14px rgba(0,0,0,0.08), 0px 1px 4px rgba(0,0,0,0.04)",
      }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
                <Bell size={18} />
              </div>
              <div>
                <p className="text-lg font-semibold">Lembretes Inteligentes</p>
                <p className="text-sm text-white/80">Configure suas notificacoes</p>
              </div>
            </div>
            <ArrowRight
        size={22}
        className="
          text-white
          transition-transform
          duration-200
          group-hover:translate-x-1
        "
      />
    </div>
  );
}