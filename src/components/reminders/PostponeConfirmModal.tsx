import { Clock } from "lucide-react";
import type { PostponeOption } from "./PostponeModal";

type PostponeConfirmModalProps = {
  option: PostponeOption;
  onDismiss: () => void;
  onBack: () => void;
};

/**
 * Modal de confirmacao exibido apos o usuario
 * selecionar um tempo de adiamento.
 *
 * Informa ao usuario que o lembrete foi adiado
 * e oferece opcoes de continuar ou voltar.
 */
export default function PostponeConfirmModal({
  option,
  onDismiss,
  onBack,
}: PostponeConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="relative z-10 mx-4 w-full max-w-sm rounded-3xl bg-white px-6 py-8 shadow-xl text-center">

        {/* Icone com gradiente */}
        <div className="flex justify-center mb-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, #FF8904, #F0B100)",
              boxShadow: "0px 6px 16px rgba(249, 115, 22, 0.40)",
            }}
          >
            <Clock size={30} strokeWidth={2.5} className="text-white" />
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-800">Lembrete adiado</h2>
        <p className="mt-1 text-sm text-gray-500">
          Voce sera avisado em {option.label}
        </p>

        {/* Botao entendi com gradiente */}
        <button
          onClick={onDismiss}
          className="mt-6 w-full rounded-2xl py-3 text-sm font-semibold text-white transition"
          style={{
            background: "linear-gradient(135deg, #F89902, #F5A201)",
            boxShadow: "0px 4px 14px rgba(249,115,22,0.35)",
          }}
        >
          Entendi
        </button>

        {/* Botao voltar */}
        <button
          onClick={onBack}
          className="mt-2 w-full rounded-2xl py-3 text-sm font-semibold text-white transition"
          style={{ backgroundColor: "#FA9402" }}
        >
          Voltar para os lembretes
        </button>
      </div>
    </div>
  );
}