import {
  createProfile,
  getProfile,
} from "../../services/profileService";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AuthContext } from "./AuthContext";

import {
  getCurrentUser,
  getSession,
  login as loginService,
  logout as logoutService,
  register as registerService,
  resetPassword as resetPasswordService,
} from "../../services/authService";

import type {
  AuthContextValue,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "../../types/auth";

/**
 * ============================================================
 * AUTH CONTEXT
 * ============================================================
 *
 * Contexto global responsável por disponibilizar
 * informações de autenticação para toda a aplicação.
 *
 * O contexto é consumido através do hook:
 *
 * useAuth()
 */

/**
 * ============================================================
 * PROPS
 * ============================================================
 */
type AuthProviderProps = {
  children: ReactNode;
};

/**
 * ============================================================
 * AUTH PROVIDER
 * ============================================================
 *
 * Responsável por:
 *
 * - recuperar sessão persistida;
 * - manter usuário autenticado;
 * - expor operações de autenticação;
 * - centralizar estado global de auth.
 *
 * Fluxo:
 *
 * App
 *  └─ AuthProvider
 *      └─ Pages
 */
export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /**
   * ==========================================================
   * LOAD USER PROFILE
   * ==========================================================
   *
   * Combina informações do Auth com os dados
   * persistidos na tabela profiles.
   */
    async function loadAuthenticatedUser() {
      const currentUser =
        await getCurrentUser();

      if (!currentUser) {
        return null;
      }

      const profile =
        await getProfile(currentUser.id);

      return {
        ...currentUser,
        name:
          profile?.name ??
          currentUser.name,
      };
    }
  /**
   * ==========================================================
   * REFRESH USER
   * ==========================================================
   *
   * Recarrega o usuário atual a partir
   * da sessão persistida.
   */
  const refreshUser =
    useCallback(async () => {
      try {
        const currentUser =
          await loadAuthenticatedUser();

        setUser(currentUser);
      } catch (err) {
        console.error(
          "Erro ao carregar usuário:",
          err
        );

        setError(
          "Erro ao carregar usuário"
        );
      }
    }, []);

  /**
   * ==========================================================
   * LOGIN
   * ==========================================================
   */
  const login =
    useCallback(
      async (
        payload: LoginPayload
      ) => {
        setError(null);

        try {
          const authenticatedUser =
            await loginService(payload);

          setUser(authenticatedUser);
        } catch (err) {
          console.error(
            "Erro ao realizar login:",
            err
          );

          const message =
            err instanceof Error
              ? err.message
              : "Erro ao realizar login";

          setError(message);

          throw err;
        }
      },
      []
    );

  /**
   * ==========================================================
   * REGISTER
   * ==========================================================
   */
  const register =
    useCallback(
      async (
        payload: RegisterPayload
      ) => {
        setError(null);

        try {
          const newUser =
          await registerService(
            payload
          );

          /**
           * ========================================================
           * CREATE PROFILE
           * ========================================================
           *
           * Cria o registro inicial do usuário
           * na tabela profiles.
           *
           * Mantemos esta responsabilidade fora
           * do authService para preservar a
           * separação entre autenticação e
           * domínio da aplicação.
           */
          await createProfile(newUser);

          setUser(newUser);
        } catch (err) {
          console.error(
            "Erro ao criar conta:",
            err
          );

          const message =
            err instanceof Error
              ? err.message
              : "Erro ao criar conta";

          setError(message);

          throw err;
        }
      },
      []
    );

  /**
   * ==========================================================
   * LOGOUT
   * ==========================================================
   */
  const logout =
    useCallback(async () => {
      setError(null);

      try {
        await logoutService();

        setUser(null);
      } catch (err) {
        console.error(
          "Erro ao realizar logout:",
          err
        );

        const message =
          err instanceof Error
            ? err.message
            : "Erro ao realizar logout";

        setError(message);

        throw err;
      }
    }, []);

  /**
   * ==========================================================
   * RESET PASSWORD
   * ==========================================================
   */
  const resetPassword =
    useCallback(
      async (
        payload: ResetPasswordPayload
      ) => {
        setError(null);

        try {
          await resetPasswordService(
            payload
          );
        } catch (err) {
          console.error(
            "Erro ao enviar recuperação:",
            err
          );

          const message =
            err instanceof Error
              ? err.message
              : "Erro ao enviar recuperação";

          setError(message);

          throw err;
        }
      },
      []
    );

  /**
   * ==========================================================
   * SESSION RECOVERY
   * ==========================================================
   *
   * Executado ao iniciar a aplicação.
   *
   * Objetivo:
   *
   * - recuperar sessão persistida;
   * - restaurar usuário autenticado.
   */
  useEffect(() => {
    async function initializeAuth() {
      try {
        const session =
          await getSession();

        if (session) {
          const currentUser =
            await loadAuthenticatedUser();

          setUser(currentUser);
        }
      } catch (err) {
        console.error(
          "Erro ao recuperar sessão:",
          err
        );

        setError(
          "Erro ao recuperar sessão"
        );
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();
  }, []);

  /**
   * ==========================================================
   * CONTEXT VALUE
   * ==========================================================
   *
   * Memoriza o valor para evitar
   * renderizações desnecessárias.
   */
  const value =
    useMemo<AuthContextValue>(
      () => ({
        user,
        loading,
        error,
        login,
        register,
        logout,
        resetPassword,
        refreshUser,
      }),
      [
        user,
        loading,
        error,
        login,
        register,
        logout,
        resetPassword,
        refreshUser,
      ]
    );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}