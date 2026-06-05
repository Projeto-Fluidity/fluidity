import { supabase } from "./supabaseClient";

import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "../types/auth";

/**
 * ============================================================
 * MAP SUPABASE USER
 * ============================================================
 *
 * Converte o modelo retornado pelo Supabase
 * para o modelo utilizado pela aplicação.
 */
function mapAuthUser(user: {
  id: string;
  email?: string | null;
  user_metadata?: {
    name?: string;
  };
}): AuthUser {
  return {
    id: user.id,
    email: user.email ?? "",
    name: user.user_metadata?.name ?? "",
  };
}

/**
 * ============================================================
 * LOGIN
 * ============================================================
 *
 * Realiza autenticação utilizando email e senha.
 */
export async function login(
  payload: LoginPayload
): Promise<AuthUser> {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("Usuário não encontrado");
  }

  return mapAuthUser(data.user);
}

/**
 * ============================================================
 * REGISTER
 * ============================================================
 *
 * Cria uma nova conta utilizando Supabase Auth.
 *
 * A criação do profile será responsabilidade
 * do profileService.
 */
export async function register(
  payload: RegisterPayload
): Promise<AuthUser> {
  const { data, error } =
    await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          name: payload.name,
        },
      },
    });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("Falha ao criar usuário");
  }

  return mapAuthUser(data.user);
}

/**
 * ============================================================
 * LOGOUT
 * ============================================================
 *
 * Encerra a sessão atual.
 */
export async function logout(): Promise<void> {
  const { error } =
    await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * ============================================================
 * RESET PASSWORD
 * ============================================================
 *
 * Envia email de recuperação de senha.
 */
export async function resetPassword(
    payload: ResetPasswordPayload
  ): Promise<void> {
    const { error } =
      await supabase.auth.resetPasswordForEmail(
        payload.email,
        {
          redirectTo:
            `${window.location.origin}/reset-password`,
        }
      );

    if (error) {
      throw new Error(error.message);
    }
  }
/**
 * ============================================================
 * CURRENT USER
 * ============================================================
 *
 * Obtém o usuário autenticado atual.
 */
export async function getCurrentUser():
  Promise<AuthUser | null> {

  const { data, error } =
    await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    return null;
  }

  return mapAuthUser(data.user);
}

/**
 * ============================================================
 * CURRENT SESSION
 * ============================================================
 *
 * Recupera a sessão persistida pelo Supabase.
 */
export async function getSession() {
  const { data, error } =
    await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
}
