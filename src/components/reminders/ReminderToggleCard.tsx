import { Bell, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Card responsável por redirecionar o usuario
 * para a tela de configuracao de lembretes.
 */
export default function ReminderToggleCard() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/reminder-config")}
      className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition hover:bg-gray-50"
    >
      {/* Conteudo */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <Bell size={18} className="text-[#008236]" />
        </div>

        <div className="text-left">
          <p className="font-medium text-gray-800">Configurar lembretes</p>
          <p className="text-sm text-gray-500">Personalize seus alertas</p>
        </div>
      </div>

      {/* Seta de navegacao */}
      <ChevronRight size={20} className="text-gray-400" />
    </button>
  );
}