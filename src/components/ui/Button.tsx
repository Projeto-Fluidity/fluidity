import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

/**
 * Variantes visuais disponíveis para o botão.
 */
type ButtonVariant = "primary" | "error" | "success";

/**
 * Props do componente Button.
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Conteúdo exibido dentro do botão.
   */
  children: ReactNode;

  /**
   * Ícone opcional exibido à esquerda do texto.
   */
  icon?: ReactNode;

  /**
   * Variante visual do botão.
   */
  variant?: ButtonVariant;

  /**
   * Define se o botão ocupará toda a largura disponível.
   */
  fullWidth?: boolean;
}

/**
 * Componente de botão reutilizável do Design System.
 */
export default function Button({
  children,
  icon,
  variant = "primary",
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-[#008236] text-white",
    error: "bg-error text-white",
    success: "bg-success text-white",
  };

  return (
    <button
      type="button"
      className={clsx(
        "flex items-center justify-center gap-2",
        "h-[52px] px-6",
        "rounded-2xl",
        "text-base font-semibold",
        "transition-all duration-200",
        "shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)]",
        "hover:opacity-95",
        "active:scale-[0.98]",
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
}
