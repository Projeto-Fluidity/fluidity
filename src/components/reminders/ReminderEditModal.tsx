import { X } from "lucide-react";

/**
 * ============================================================
 * PROPS
 * ============================================================
 *
 * Este componente é totalmente visual.
 *
 * Ele NÃO conhece:
 *
 * - banco de dados;
 * - Supabase;
 * - services;
 * - regras de negócio;
 * - lembretes.
 *
 * Toda a lógica permanece na página que o utiliza.
 */
type Props = {
  /**
   * Controla a abertura do modal.
   */
  open: boolean;

  /**
   * Título exibido no topo do modal.
   */
  title: string;

  /**
   * Horário atualmente selecionado.
   */
  time: string;

  /**
   * Disparado quando o usuário altera o horário.
   */
  onTimeChange: (value: string) => void;

  /**
   * Disparado ao salvar a configuração.
   */
  onSave: () => void;

  /**
   * Fecha o modal.
   */
  onClose: () => void;
};

/**
 * ============================================================
 * REMINDER EDIT MODAL
 * ============================================================
 *
 * Responsável apenas pela interface de edição
 * de um lembrete.
 *
 * Este componente não possui estado próprio e
 * não executa qualquer regra de negócio.
 *
 * Todo o estado é controlado pela página que
 * renderiza este componente.
 */
export default function ReminderEditModal({
  open,
  title,
  time,
  onTimeChange,
  onSave,
  onClose,
}: Props) {
  /**
   * ==========================================================
   * MODAL FECHADO
   * ==========================================================
   *
   * Quando "open" for falso, nada é renderizado.
   */
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* ======================================================
          BACKDROP
         ====================================================== */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ======================================================
          MODAL
         ====================================================== */}
      <div className="relative z-10 w-full max-w-sm space-y-5 rounded-3xl bg-white px-6 py-6 shadow-xl">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
        >
          <X size={14} />
        </button>

        {/* Título */}
        <p className="text-base font-semibold text-gray-800">{title}</p>

        {/* Campo de horário */}
        <input
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full rounded-xl border p-2"
        />

        {/* Ações */}
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border py-2">
            Cancelar
          </button>

          <button
            onClick={onSave}
            className="flex-1 rounded-xl bg-green-600 py-2 text-white"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
