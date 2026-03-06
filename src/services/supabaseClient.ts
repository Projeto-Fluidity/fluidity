import { createClient } from "@supabase/supabase-js"

/**
 * URL da instância Supabase.
 *
 * Valor definido nas variáveis de ambiente.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

/**
 * Chave pública de acesso à API do Supabase.
 *
 * Utilizada para autenticação do cliente no frontend.
 */
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Instância do cliente Supabase.
 *
 * Responsável por realizar operações no banco
 * de dados PostgreSQL através da API do Supabase.
 */
export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)
