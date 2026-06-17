import { Info } from "lucide-react";

type Props = {
  onClose: () => void;
};

/**
 * Modal exibido quando o usuário
 * já realizou o check-in do dia.
 *
 * Essa situação não representa erro.
 * Trata-se de uma regra de negócio válida.
 *
 * O objetivo é informar o usuário
 * sem removê-lo da tela Emotion.
 */
export function MoodAlreadyRegisteredModal({
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[3px] flex items-center justify-center z-50">

      <div className="w-[330px] rounded-[32px] p-7 text-center bg-[#F9FAFB] border border-green-500 shadow-[0_20px_40px_rgba(0,0,0,0.08)]">

        {/* Ícone informativo */}
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <Info
              size={24}
              className="text-green-700"
            />
          </div>
        </div>

        {/* Título */}
        <h2 className="mt-6 text-lg font-semibold text-gray-800">
          Você já registrou seu humor hoje
        </h2>

        {/* Descrição */}
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Seu check-in de hoje já foi realizado.
          <br />
          Volte amanhã para registrar como está se sentindo novamente.
        </p>

        {/* Botão */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-full bg-green-700 text-white font-medium shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:bg-green-800 transition"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
