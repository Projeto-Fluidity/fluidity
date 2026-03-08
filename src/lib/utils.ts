import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitário para combinar classes CSS de forma segura.
 *
 * Este helper combina a biblioteca `clsx` com `tailwind-merge`
 * para permitir a construção condicional de classes Tailwind
 * sem gerar conflitos entre utilitários.
 *
 * Benefícios:
 * - Permite aplicar classes condicionais com facilidade
 * - Resolve automaticamente conflitos de classes Tailwind
 * - Mantém o código mais legível nos componentes
 *
 * Exemplo de uso:
 *
 * cn("p-2", isActive && "bg-blue-500")
 *
 * @param inputs Lista de classes CSS ou condições
 * @returns String final de classes combinadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
