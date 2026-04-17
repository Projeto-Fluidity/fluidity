/**
 * ============================================================
 * TIPOS
 * ============================================================
 */

type DataMode = "seed" | "storage" | "api";

type EnvConfig = {
  dataMode: DataMode;

  // legado (será removido no futuro)
  useMock: boolean;
  reminderSource: "seed" | "storage";
  moodSource: DataMode;

  // debug / QA
  forceError: boolean;
};

/**
 * ============================================================
 * LEITURA DAS VARIÁVEIS DE AMBIENTE (.env)
 * ============================================================
 */

const reminderSourceEnv = import.meta.env.VITE_REMINDER_SOURCE;
const moodSourceEnv = import.meta.env.VITE_MOOD_SOURCE;
const dataModeEnv = import.meta.env.VITE_DATA_MODE;
const forceErrorEnv = import.meta.env.VITE_FORCE_ERROR;

/**
 * ============================================================
 * FUNÇÕES DE RESOLUÇÃO (ENV)
 * ============================================================
 */

function resolveDataMode(): DataMode | null {
  if (dataModeEnv === "seed") return "seed";
  if (dataModeEnv === "storage") return "storage";
  if (dataModeEnv === "api") return "api";
  return null;
}

function resolveReminderSource(): "seed" | "storage" {
  if (reminderSourceEnv === "seed") return "seed";
  return "storage";
}

function resolveMoodSource(): DataMode {
  if (moodSourceEnv === "seed") return "seed";
  if (moodSourceEnv === "storage") return "storage";
  return "api";
}

/**
 * ============================================================
 * OVERRIDE VIA LOCALSTORAGE (DEVTOOLS)
 * ============================================================
 */

function getOverride<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  return value ? (value as T) : null;
}

const dataModeOverride = getOverride<DataMode>("debug:dataMode");
const moodOverride = getOverride<DataMode>("debug:moodSource");
const reminderOverride = getOverride<"seed" | "storage">(
  "debug:reminderSource"
);
const forceErrorOverride = getOverride<"true" | "false">(
  "debug:forceError"
);

/**
 * ============================================================
 * RESOLUÇÃO FINAL
 * ============================================================
 */

/**
 * DATA MODE (principal)
 */
const resolvedDataMode: DataMode =
  dataModeOverride ??
  resolveDataMode() ??
  moodOverride ??
  resolveMoodSource() ??
  (import.meta.env.VITE_USE_MOCK === "true" ? "storage" : "api");

/**
 * FORCE ERROR (QA)
 *
 * Prioridade:
 * 1. Override DevTools
 * 2. .env
 * 3. default false
 */
const resolvedForceError: boolean =
  forceErrorOverride !== null
    ? forceErrorOverride === "true"
    : forceErrorEnv === "true";

/**
 * ============================================================
 * EXPORT FINAL
 * ============================================================
 */

export const env: EnvConfig = {
  dataMode: resolvedDataMode,

  // legado
  useMock: import.meta.env.VITE_USE_MOCK === "true",
  reminderSource: reminderOverride ?? resolveReminderSource(),
  moodSource: moodOverride ?? resolveMoodSource(),

  // debug / QA
  forceError: resolvedForceError,
};
