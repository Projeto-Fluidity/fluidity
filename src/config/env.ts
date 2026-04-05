type EnvConfig = {
  useMock: boolean;
  reminderSource: "seed" | "storage";
  moodSource: "seed" | "storage" | "api";
};

/**
 * ============================================================
 * ENV CONFIG (Fonte única de verdade)
 * ============================================================
 *
 * Este arquivo centraliza TODAS as decisões de configuração
 * da aplicação.
 *
 * Ele combina:
 *
 * 1. Variáveis de ambiente (.env)
 * 2. Overrides locais (localStorage - DevTools)
 *
 * Prioridade:
 * override (DevTools) > .env
 *
 * Isso permite alterar comportamento SEM reiniciar a aplicação.
 */

const reminderSourceEnv = import.meta.env.VITE_REMINDER_SOURCE;
const moodSourceEnv = import.meta.env.VITE_MOOD_SOURCE;

/**
 * Resolve a fonte de lembretes baseada no .env
 */
function resolveReminderSource(): "seed" | "storage" {
  if (reminderSourceEnv === "seed") return "seed";
  return "storage";
}

/**
 * Resolve a fonte de humor baseada no .env
 */
function resolveMoodSource(): "seed" | "storage" | "api" {
  if (moodSourceEnv === "seed") return "seed";
  if (moodSourceEnv === "storage") return "storage";
  return "api";
}

/**
 * Busca override salvo no localStorage (usado pelo DevTools)
 *
 * Exemplo:
 * localStorage.setItem("debug:moodSource", "seed")
 */
function getOverride<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  return value ? (value as T) : null;
}

/**
 * Overrides (se existirem)
 */
const moodOverride = getOverride<"seed" | "storage" | "api">(
  "debug:moodSource"
);

const reminderOverride = getOverride<"seed" | "storage">(
  "debug:reminderSource"
);

/**
 * Export final (usado no sistema inteiro)
 */
export const env: EnvConfig = {
  useMock: import.meta.env.VITE_USE_MOCK === "true",

  // prioridade: override > env
  reminderSource: reminderOverride ?? resolveReminderSource(),

  moodSource: moodOverride ?? resolveMoodSource(),
};
