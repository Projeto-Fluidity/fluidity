import { useNavigate } from "react-router-dom";

import { ChevronLeft } from "lucide-react";

import ReminderNavigationCard from "../components/reminders/ReminderNavigationCard";
import Toggle from "../components/ui/Toggle";

import { useNotificationSettings } from "../hooks/useNotificationSettings";

/**
 * ============================================================
 * SETTINGS PAGE
 * ============================================================
 *
 * Responsável apenas por compor a interface da tela
 * de Configurações.
 *
 * Toda a regra de negócio relacionada às preferências
 * de notificações encontra-se encapsulada no
 * useNotificationSettings.
 */
export default function Settings() {
  const navigate = useNavigate();

  /**
   * ==========================================================
   * HOOKS
   * ==========================================================
   */

  const { generalSettings, handleToggleGeneral } = useNotificationSettings();

  /**
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <div className="min-h-screen bg-[#DCFCE7] pb-24">
      <div className="px-4 pt-6">
        {/**
         * ======================================================
         * HEADER
         * ======================================================
         */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white"
          >
            <ChevronLeft size={18} />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-[#0F172A]">
              Configurações
            </h1>

            <p className="text-xs text-[#64748B]">Personalize seus lembretes</p>
          </div>
        </div>

        {/**
         * ======================================================
         * GENERAL SETTINGS
         * ======================================================
         */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <span className="mb-3 block text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
            Geral
          </span>

          <div className="space-y-4">
            {generalSettings.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                    {item.icon}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">
                      {item.label}
                    </p>

                    <p className="text-xs text-[#94A3B8]">{item.description}</p>
                  </div>
                </div>

                <Toggle
                  active={item.enabled}
                  onToggle={() => handleToggleGeneral(item.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/**
         * ======================================================
         * SMART REMINDERS
         * ======================================================
         */}
        <div className="mt-5">
          <ReminderNavigationCard />
        </div>
      </div>
    </div>
  );
}
