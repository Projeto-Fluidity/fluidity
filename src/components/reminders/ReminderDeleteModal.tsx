import { AlertTriangle, X } from "lucide-react";

/**
 * ============================================================
 * PROPS
 * ============================================================
 *
 * Este componente é exclusivamente visual.
 *
 * Responsabilidades:
 *
 * • exibir confirmação de exclusão;
 * • disparar eventos da interface.
 *
 * NÃO conhece:
 *
 * • banco de dados;
 * • Supabase;
 * • services;
 * • regras de negócio;
 * • ScheduledReminder.
 */
type Props = {
  /**
   * Controla a abertura do modal.
   */
  open: boolean;

  /**
   * Nome do lembrete que será exibido
   * na mensagem de confirmação.
   */
  title: string;

  /**
   * Executado quando o usuário confirma
   * a exclusão.
   */
  onConfirm: () => void;

  /**
   * Fecha o modal.
   */
  onClose: () => void;
};

/**
 * ============================================================
 * REMINDER DELETE MODAL
 * ============================================================
 *
 * Modal responsável apenas pela confirmação
 * da exclusão de um lembrete.
 */
export default function ReminderDeleteModal({
  open,
  title,
  onConfirm,
  onClose,
}: Props) {
  /**
   * ==========================================================
   * MODAL FECHADO
   * ==========================================================
   */
  if (!open) {
    return null;
  }

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
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white px-6 py-6 shadow-xl">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
        >
          <X size={14} />
        </button>

        {/* Ícone */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle size={26} className="text-red-500" />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-center text-lg font-semibold text-gray-800">
          Excluir lembrete
        </h2>

        {/* Mensagem */}
        <p className="mt-3 text-center text-sm leading-6 text-gray-500">
          Tem certeza que deseja excluir o lembrete
          <span className="font-semibold text-gray-700"> "{title}"</span>?
        </p>

        <p className="mt-2 text-center text-xs text-gray-400">
          Esta ação não poderá ser desfeita.
        </p>

        {/* Ações */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border py-3 font-medium"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 py-3 font-medium text-white transition hover:bg-red-600"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
