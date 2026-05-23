import { createClient } from "@supabase/supabase-js";
import { getDeviceId } from "../lib/deviceId";

/**
 * ============================================================
 * CONFIGURAÇÃO DO CLIENTE SUPABASE
 * ============================================================
 *
 * Este arquivo é responsável por criar e exportar uma instância
 * do cliente Supabase que será usada em toda a aplicação.
 *
 * A partir desse cliente conseguimos:
 * - Ler dados do banco
 * - Inserir dados
 * - Atualizar registros
 * - Executar queries
 *
 * Ele funciona como a "porta de entrada" para o backend.
 */

/**
 * URL do projeto no Supabase.
 *
 * Essa informação vem do arquivo .env e identifica
 * qual projeto estamos acessando.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

/**
 * Chave pública (anon key).
 *
 * Essa chave permite que o frontend se comunique com o Supabase.
 * Mesmo sendo pública, ela respeita as regras de segurança (RLS).
 */
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Criação do cliente Supabase.
 *
 * Aqui configuramos duas coisas importantes:
 *
 * 1. URL + KEY → conexão com o projeto
 * 2. headers globais → enviados em TODAS as requisições
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    headers: {
      /**
       * device_id é um identificador único do dispositivo.
       *
       * Como ainda não temos autenticação (login),
       * usamos esse ID para identificar "quem" está fazendo a requisição.
       *
       * Esse valor será enviado automaticamente em todas as chamadas:
       * - select
       * - insert
       * - update
       *
       * No banco (Supabase), usamos esse valor nas policies (RLS)
       * para permitir que cada dispositivo acesse apenas seus próprios dados.
       *
       * Exemplo de uso no banco:
       * device_id = current_setting('request.headers.device_id', true)
       */
      "x-device_id": getDeviceId(),
    },
  },
});
