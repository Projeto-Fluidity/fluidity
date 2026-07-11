import Toggle from "../ui/Toggle";

/**
 * ============================================================
 * PROPS
 * ============================================================
 */
type Props = {
  /**
   * Título exibido no card.
   */
  title: string;

  /**
   * Descrição exibida abaixo do título.
   */
  description: string;

  /**
   * Estado atual do lembrete.
   */
  active: boolean;

  /**
   * Disparado quando o usuário altera o estado.
   */
  onToggle: () => void;

  /**
   * Desabilita a interação.
   */
  disabled?: boolean;
};

/**
 * ============================================================
 * REMINDER ACTIVATION SECTION
 * ============================================================
 *
 * Responsável apenas por exibir a configuração
 * de ativação do lembrete.
 *
 * Este componente possui apenas responsabilidade
 * de interface.
 *
 * Toda regra de negócio permanece no hook que
 * controla a tela.
 */
export default function ReminderActivationSection({
  title,
  description,
  active,
  onToggle,
  disabled = false,
}: Props) {
  return (

      /*** ======================================================
      CARD
      ====================================================== ***/
    <div
      className="mt-4 rounded-2xl bg-white px-5 py-4"
      style={{
        border: "1.18px solid #B9F8CF",
        boxShadow:
          "0px 4px 14px rgba(0,0,0,0.08), 0px 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">
            {title}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>

        <Toggle
          active={active}
          onToggle={onToggle}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
