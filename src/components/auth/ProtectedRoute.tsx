import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

/**
 * ============================================================
 * PROPS
 * ============================================================
 *
 * children:
 * Conteúdo protegido que será renderizado
 * apenas para usuários autenticados.
 */
type ProtectedRouteProps = {
  children: ReactNode;
};

/**
 * ============================================================
 * PROTECTED ROUTE
 * ============================================================
 *
 * Responsável por proteger páginas que exigem
 * autenticação.
 *
 * Fluxo:
 *
 * Usuário autenticado
 *      ↓
 * Renderiza página
 *
 * Usuário não autenticado
 *      ↓
 * Redireciona para /login
 *
 * Importante:
 *
 * Não realiza chamadas ao Supabase.
 *
 * Toda a lógica de autenticação deve permanecer
 * centralizada no AuthProvider.
 */
export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const {
    user,
    loading,
  } = useAuth();

  /**
   * ==========================================================
   * AUTH LOADING
   * ==========================================================
   *
   * Enquanto a sessão está sendo recuperada,
   * evitamos renderizar a aplicação ou realizar
   * redirecionamentos prematuros.
   */
  if (loading) {
    return null;
  }

  /**
   * ==========================================================
   * NOT AUTHENTICATED
   * ==========================================================
   */
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /**
   * ==========================================================
   * AUTHENTICATED
   * ==========================================================
   */
  return <>{children}</>;
}
