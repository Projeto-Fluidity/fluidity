import { useState } from "react";

import ReminderStatsCard from "../components/reminders/ReminderStatsCard";
import ReminderItemCard from "../components/reminders/ReminderItemCard";
import ReminderToggleCard from "../components/reminders/ReminderToggleCard";
import PostponeModal from "../components/reminders/PostponeModal";
import PostponeConfirmModal from "../components/reminders/PostponeConfirmModal";
import { useReminders } from "../hooks/useReminders";
import { resetReminderLogs } from "../services/reminderService";
import type { PostponeOption } from "../components/reminders/PostponeModal";

/**
 * Etapas do fluxo de adiamento de um lembrete.
 *
 * idle      → nenhum modal aberto
 * selecting → modal de selecao de tempo aberto
 * confirmed → modal de confirmacao aberto
 */
type PostponeStep = "idle" | "selecting" | "confirmed";

/**
 * Tela responsavel por exibir lembretes inteligentes
 * com base no comportamento do usuario.
 *
 * Fluxo de adiamento:
 * 1. Usuario clica em "Mais tarde" em um card
 * 2. Modal de selecao de tempo e exibido (PostponeModal)
 * 3. Usuario seleciona uma opcao
 * 4. Modal de confirmacao e exibido (PostponeConfirmModal)
 * 5. Usuario clica em "Entendi" ou "Voltar" para encerrar
 */
export default function Reminders() {
  const {
    reminders,
    feedback,
    acceptReminder,
    postponeReminder,
    reloadReminders,
  } = useReminders();

  /**
   * Etapa atual do fluxo de adiamento.
   */
  const [postponeStep, setPostponeStep] = useState<PostponeStep>("idle");

  /**
   * Id do lembrete que esta sendo adiado.
   */
  const [postponingId, setPostponingId] = useState<string | null>(null);

  /**
   * Opcao de adiamento selecionada pelo usuario.
   */
  const [selectedOption, setSelectedOption] = useState<PostponeOption | null>(null);

  /**
   * Abre o modal de selecao de tempo para o lembrete informado.
   */
  function handlePostponeClick(id: string) {
    setPostponingId(id);
    setPostponeStep("selecting");
  }

  /**
   * Registra a opcao selecionada e avanca para a confirmacao.
   */
  function handleOptionSelect(option: PostponeOption) {
    setSelectedOption(option);
    setPostponeStep("confirmed");

    if (postponingId) {
      postponeReminder(postponingId);
    }
  }

  /**
   * Encerra o fluxo de adiamento e limpa o estado.
   */
  function handleClose() {
    setPostponeStep("idle");
    setPostponingId(null);
    setSelectedOption(null);
  }

  return (
    <>
      {/* Toast de feedback */}
      {feedback && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 rounded-xl bg-black px-4 py-2 text-sm text-white shadow-md">
          {feedback}
        </div>
      )}

      {/* Modal de selecao de tempo */}
      {postponeStep === "selecting" && (
        <PostponeModal
          onSelect={handleOptionSelect}
          onClose={handleClose}
        />
      )}

      {/* Modal de confirmacao */}
      {postponeStep === "confirmed" && selectedOption && (
        <PostponeConfirmModal
          option={selectedOption}
          onDismiss={handleClose}
          onBack={handleClose}
        />
      )}

      <div className="flex-1 bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] p-4">
        <div className="space-y-3">

          {/* Cabecalho */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Lembretes</h1>
            <p className="text-sm text-gray-600">Sugestoes inteligentes para voce</p>
          </div>

          {/* Metricas */}
          <ReminderStatsCard />

          {/* Lista */}
          <h2 className="text-sm font-medium text-gray-700">Sugestoes de hoje</h2>

          {reminders.map((reminder) => (
            <ReminderItemCard
              key={reminder.id}
              title={reminder.title}
              description={reminder.description}
              time={reminder.time}
              variant={reminder.variant}
              onAccept={() => acceptReminder(reminder.id)}
              onPostpone={() => handlePostponeClick(reminder.id)}
            />
          ))}

          {/* Configuracao */}
          <ReminderToggleCard />
        </div>

        {import.meta.env.DEV && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={async () => {
                await resetReminderLogs();
                await reloadReminders();
              }}
              className="rounded-lg border border-red-400 px-3 py-2 text-xs text-red-500 hover:bg-red-50"
            >
              Resetar lembretes (QA)
            </button>
          </div>
        )}
      </div>
    </>
  );
}