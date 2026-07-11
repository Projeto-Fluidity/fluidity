import { Clock, Bell } from "lucide-react";

import {
  postponeOptions,
  type PostponeOption,
} from "../../data/postponeOptions";

type PostponeModalProps = {
  onSelect: (option: PostponeOption) => void;
  onClose: () => void;
};

/**
 * Modal exibido quando o usuario clica em "Mais tarde".
 *
 * Apresenta opcoes de tempo para adiar o lembrete.
 * A selecao de uma opcao dispara o callback onSelect.
 */
export default function PostponeModal({
  onSelect,
  onClose,
}: PostponeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay com desfoque */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Conteudo do modal */}
      <div
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl bg-[#FFF8F0] shadow-xl"
        style={{ maxHeight: "calc(100vh - 80px)" }}
      >
        {/* Area com scroll */}
        <div
          className="overflow-y-auto px-6 pb-6 pt-6"
          style={{ maxHeight: "calc(100vh - 80px)" }}
        >
          {/* Botao fechar */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-500 transition hover:bg-gray-200"
          >
            x
          </button>

          {/* Icone principal com sino sobreposto */}
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  background: "linear-gradient(135deg, #FF8904, #F0B100)",
                  boxShadow: "0px 6px 16px rgba(249, 115, 22, 0.40)",
                }}
              >
                <Clock size={30} strokeWidth={2.5} className="text-white" />
              </div>

              <div
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full shadow-md"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <Bell
                  size={12}
                  strokeWidth={2.5}
                  style={{ color: "#F54900" }}
                />
              </div>
            </div>
          </div>

          {/* Titulo */}
          <div className="mb-4 text-center">
            <h2 className="text-lg font-bold text-gray-800">Adiar Lembrete</h2>
            <p className="mt-1 text-sm text-gray-500">
              Por quanto tempo voce quer adiar
              <br />
              este lembrete?
            </p>
          </div>

          {/* Opcoes */}
          <div className="mb-4 space-y-2">
            {postponeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onSelect(option)}
                className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 transition hover:bg-orange-50"
                style={{
                  boxShadow:
                    "0px 2px 8px rgba(0,0,0,0.08), 0px 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50"
                    style={{ boxShadow: "0px 2px 6px rgba(249,115,22,0.15)" }}
                  >
                    <Clock
                      size={16}
                      strokeWidth={2.5}
                      className="text-orange-400"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800">
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-400">
                      {option.description}
                    </p>
                  </div>
                </div>
                <span className="text-base text-gray-300">›</span>
              </button>
            ))}
          </div>

          {/* Botao adiar lembrete */}
          <button
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-white transition"
            style={{
              backgroundColor: "#F99602",
              boxShadow: "0px 4px 14px rgba(249,150,2,0.35)",
            }}
            onClick={onClose}
          >
            <Clock size={16} strokeWidth={2.5} />
            Adiar lembrete
          </button>

          {/* Botao voltar */}
          <button
            onClick={onClose}
            className="mt-2 w-full rounded-2xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Voltar aos lembretes
          </button>

          <p className="mt-3 text-center text-xs text-gray-400">
            O lembrete sera reagendado automaticamente
          </p>
        </div>
      </div>
    </div>
  );
}
