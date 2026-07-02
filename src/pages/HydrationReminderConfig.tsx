import { ChevronLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ReminderConfigSummary from "../components/reminders/ReminderConfigSummary";
import ReminderConfigItem from "../components/reminders/ReminderConfigItem";

/**
 * ============================================================
 * HYDRATION REMINDER CONFIG
 * ============================================================
 *
 * Tela responsável pela configuração dos
 * lembretes de hidratação.
 *
 * Nesta primeira etapa a tela possui apenas
 * a estrutura visual.
 *
 * Nenhuma regra de negócio é aplicada neste
 * momento.
 *
 * Futuramente esta tela será responsável por:
 *
 * - carregar lembretes do banco;
 * - adicionar novos lembretes;
 * - editar horários;
 * - excluir lembretes personalizados;
 * - ativar/desativar lembretes.
 */
export default function HydrationReminderConfig() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] p-4">

      {/* ======================================================
          HEADER
         ====================================================== */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>

        <h1 className="text-xl font-bold">
          Configurar Lembretes
        </h1>
      </div>

      {/* ======================================================
          RESUMO
         ====================================================== */}
      <ReminderConfigSummary
        title="Lembretes de hidratação"
        description="Adicione lembretes ao longo do dia para manter uma boa hidratação."
      />

      {/* ======================================================
          LISTA DE LEMBRETES
         ======================================================

         Nesta etapa os cards são apenas
         ilustrativos.

         Posteriormente serão carregados
         dinamicamente do banco de dados.
      */}
      <div className="space-y-3 mt-4">

        {/* ==============================================
            LEMBRETE FIXO
           ==============================================

           Representa o lembrete obrigatório da
           funcionalidade.

           Não poderá ser removido, portanto
           o botão de exclusão permanece oculto.
        */}
        <ReminderConfigItem
          label="Hora de se hidratar"
          time="09:00"
          customDays={[
            "seg",
            "ter",
            "qua",
            "qui",
            "sex",
            "sab",
            "dom",
          ]}
          active={true}
          canDelete={false}
          onToggle={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
        />
        
      </div>

      {/* ======================================================
          AÇÃO
         ======================================================

         Nesta etapa o botão ainda não possui
         comportamento.

         Em uma próxima entrega ele abrirá o
         modal para criação de novos lembretes.
      */}
      <button
        className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Adicionar lembrete
      </button>
    </div>
  );
}
