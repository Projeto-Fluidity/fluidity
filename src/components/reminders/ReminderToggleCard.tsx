import { Bell } from "lucide-react";

/**
 * Card responsável por permitir
 * a configuração dos lembretes do usuário.
 */
export default function ReminderToggleCard() {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
      {/* Conteúdo */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <Bell size={18} className="text-[#008236]" />
        </div>

        <div>
          <p className="font-medium text-gray-800">
            Configurar lembretes
          </p>
          <p className="text-sm text-gray-500">
            Personalize seus alertas
          </p>
        </div>
      </div>

      {/* Toggle visual (mock) */}
      <div className="h-6 w-10 rounded-full bg-[#008236]" />
    </div>
  );
}