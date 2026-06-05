import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
} from "react";

import clsx from "clsx";

import {
  Eye,
  EyeOff,
} from "lucide-react";

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
      type,
      ...props
    },
    ref
  ) => {
    const inputId =
      id ?? props.name ?? crypto.randomUUID();

    const [showPassword, setShowPassword] =
      useState(false);

    const isPasswordField =
      type === "password";

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
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={
              isPasswordField
              ? showPassword
                ? "text"
                : "password"
              : type
            }
            className={clsx(
              "w-full rounded-2xl border",
              "bg-white px-4 py-3",
              "pr-12",
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

            {isPasswordField && (
              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={
                  showPassword
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            )}
        </div>

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
