import { useContext } from "react";

import { AuthContext } from "../components/auth/AuthContext";

import type { AuthContextValue } from "../types/auth";

/**
 * ============================================================
 * USE AUTH
 * ============================================================
 *
 * Hook responsável por fornecer acesso ao
 * contexto global de autenticação.
 *
 * Benefícios:
 *
 * - evita prop drilling;
 * - centraliza estado do usuário;
 * - garante uma única fonte de verdade;
 * - simplifica consumo da autenticação.
 *
 * Fluxo:
 *
 * AuthProvider
 *      ↓
 * AuthContext
 *      ↓
 * useAuth()
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  /**
   * ==========================================================
   * SAFETY CHECK
   * ==========================================================
   *
   * Garante que o hook esteja sempre sendo
   * utilizado dentro do AuthProvider.
   */
  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}
