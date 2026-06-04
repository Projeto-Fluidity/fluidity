import { supabase } from "./supabaseClient";

import type { AuthUser } from "../types/auth";

/**
 * ============================================================
 * PROFILE
 * ============================================================
 *
 * Representa os dados persistidos na tabela
 * profiles.
 *
 * Mantemos este tipo local ao service para
 * evitar acoplamento prematuro.
 */
type Profile = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

/**
 * ============================================================
 * CREATE PROFILE
 * ============================================================
 *
 * Cria o registro inicial do usuário na tabela
 * profiles após o cadastro no Supabase Auth.
 *
 * IMPORTANTE:
 *
 * O id deve ser exatamente o mesmo id
 * gerado pelo auth.users.
 */
export async function createProfile(
  user: AuthUser
): Promise<Profile> {
  const { data, error } =
    await supabase
      .from("profiles")
      .insert({
        id: user.id,
        name: user.name,
        email: user.email,
      })
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * ============================================================
 * GET PROFILE
 * ============================================================
 *
 * Recupera o profile do usuário autenticado.
 */
export async function getProfile(
  userId: string
): Promise<Profile | null> {
  const { data, error } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

  /**
   * Nenhum profile encontrado.
   */
  if (error?.code === "PGRST116") {
    return null;
  }

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * ============================================================
 * UPDATE PROFILE
 * ============================================================
 *
 * Atualiza informações editáveis do perfil.
 *
 * Preparado para futuras telas:
 *
 * - editar nome
 * - onboarding
 * - avatar
 * - preferências
 */
export async function updateProfile(
  userId: string,
  data: Pick<Profile, "name">
): Promise<Profile> {
  const { data: updatedProfile, error } =
    await supabase
      .from("profiles")
      .update({
        name: data.name,
      })
      .eq("id", userId)
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return updatedProfile;
}
