import {
  forwardRef,
  type InputHTMLAttributes,
} from "react";

import clsx from "clsx";

/**
 * ============================================================
 * INPUT PROPS
 * ============================================================
 *
 * Componente reutilizável utilizado pelos formulários
 * da aplicação.
 *
 * Compatível com:
 * - React Hook Form
 * - Zod
 * - TypeScript strict
 */
export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Texto exibido acima do campo.
   */
  label: string;

  /**
   * Mensagem de erro do campo.
   */
  error?: string;
}

/**
 * ============================================================
 * INPUT
 * ============================================================
 *
 * Responsabilidades:
 *
 * - exibir label
 * - exibir input
 * - exibir mensagem de erro
 * - integrar com React Hook Form
 *
 * Não possui regras de negócio.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId =
      id ?? props.name ?? crypto.randomUUID();

    return (
      <div className="flex flex-col gap-2">
        {/* Label */}
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>

        {/* Campo */}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full rounded-2xl border",
            "bg-white px-4 py-3",
            "text-sm text-gray-900",
            "outline-none transition-colors",
            "placeholder:text-gray-400",
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-200 focus:border-green-600",
            className
          )}
          {...props}
        />

        {/* Erro */}
        {error && (
          <span className="text-sm text-red-600">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
