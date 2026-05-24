import { createClient } from "@supabase/supabase-js";

import { ENV } from "../config/env.js";

/**
 * ============================================================
 * SUPABASE CLIENT
 * ============================================================
 *
 * Cliente administrativo utilizado
 * pelo push-server.
 *
 * ============================================================
 * IMPORTANTE
 * ============================================================
 *
 * Esse client utiliza:
 *
 * SUPABASE_SERVICE_ROLE_KEY
 *
 * Portanto:
 *
 * - possui privilégios administrativos;
 * - bypassa regras RLS;
 * - NUNCA deve ser exposto no frontend.
 *
 * ============================================================
 * RESPONSABILIDADE
 * ============================================================
 *
 * O push-server utiliza esse client para:
 *
 * - buscar subscriptions;
 * - remover subscriptions inválidas;
 * - operações administrativas de push.
 */
export const supabase = createClient(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_SERVICE_ROLE_KEY
);
