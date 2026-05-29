import dotenv from "dotenv";

/**
 * ============================================================
 * LOAD ENV FILES
 * ============================================================
 *
 * Carrega variáveis de ambiente do arquivo .env
 * para dentro do process.env.
 *
 * Isso permite:
 *
 * - ambiente local;
 * - Railway;
 * - produção;
 * - preview environments.
 */
dotenv.config();

/**
 * ============================================================
 * REQUIRED ENV VARIABLES
 * ============================================================
 *
 * Todas as variáveis obrigatórias
 * para o funcionamento do push-server.
 *
 * IMPORTANTE:
 *
 * O backend NÃO deve iniciar
 * caso alguma variável essencial esteja ausente.
 */
const requiredEnv = {
  PORT: process.env.PORT,

  SUPABASE_URL:
    process.env.SUPABASE_URL,

  SUPABASE_SERVICE_ROLE_KEY:
    process.env.SUPABASE_SERVICE_ROLE_KEY,

  VAPID_PUBLIC_KEY:
    process.env.VAPID_PUBLIC_KEY,

  VAPID_PRIVATE_KEY:
    process.env.VAPID_PRIVATE_KEY,
};

/**
 * ============================================================
 * ENV VALIDATION
 * ============================================================
 *
 * Validação defensiva.
 *
 * Evita:
 *
 * - falhas silenciosas;
 * - undefined em produção;
 * - deploy quebrado;
 * - debugging difícil.
 */
Object.entries(requiredEnv).forEach(
  ([key, value]) => {

    if (!value) {

      throw new Error(
        `Missing environment variable: ${key}`
      );
    }
  }
);

/**
 * ============================================================
 * EXPORT FINAL
 * ============================================================
 *
 * Fonte única de verdade
 * para variáveis de ambiente do backend.
 */
export const ENV = {
  PORT: Number(requiredEnv.PORT),

  SUPABASE_URL:
    requiredEnv.SUPABASE_URL!,

  SUPABASE_SERVICE_ROLE_KEY:
    requiredEnv.SUPABASE_SERVICE_ROLE_KEY!,

  VAPID_PUBLIC_KEY:
    requiredEnv.VAPID_PUBLIC_KEY!,

  VAPID_PRIVATE_KEY:
    requiredEnv.VAPID_PRIVATE_KEY!,
};
