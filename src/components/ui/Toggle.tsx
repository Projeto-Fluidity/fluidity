type ToggleProps = {
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

/**
 * Componente de Toggle reutilizável.
 *
 * Responsável por:
 * - Representar um estado ligado/desligado
 * - Permitir interação do usuário
 *
 * Props:
 * - active: estado atual (true | false)
 * - onToggle: função chamada ao clicar
 * - disabled: desabilita interação (opcional)
 */
export default function Toggle({
  active,
  onToggle,
  disabled = false,
}: ToggleProps) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={active}
      className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      style={{
        backgroundColor: active ? "#008236" : "#D1D5DB",
      }}
    >
      <div
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
          active ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
