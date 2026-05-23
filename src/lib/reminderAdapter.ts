/**
 * ============================================================
 * REMINDER ADAPTER
 * ============================================================
 *
 * Responsável por:
 * - Traduzir modelo do banco → modelo da UI
 * - Centralizar regras de disparo
 */

/**
 * ============================================================
 * TIPOS
 * ============================================================
 */

  declare global {
    var __triggerCache: Set<string> | undefined;
  }
export type DbReminder = {
  id: string;

  hour: number | null;
  minute: number | null;
  enabled: boolean | null;

  time: string | null;
  label: string | null;
  days: string[] | null;
  active: boolean | null;
};

export type UiReminder = {
  id: string;
  title: string;
  description: string;
  time: string;
  variant: "emotion" | "warning" | "info" | "relax";
};

/**
 * ============================================================
 * DB → UI
 * ============================================================
 */
export function toUiReminder(r: DbReminder): UiReminder {
  const isCheckin = r.label === "Check-in";
  const isHydration =
    r.label === "Hidratação" || r.label === "Hora de se hidratar";

  return {
    id: r.id,

    title: "Momento de cuidar de você",

    description: isCheckin
      ? "Registre seu humor e acompanhe seu bem-estar"
      : isHydration
      ? "Hora de se hidratar e cuidar do seu corpo"
      : "Cuide de você por um instante",

    time: r.time ?? "00:00",

    variant: isCheckin
      ? "emotion"
      : isHydration
      ? "info"
      : "relax",
  };
}

/**
 * ============================================================
 * FILTRO: deve disparar?
 * ============================================================
 */
export function shouldTriggerReminder(
  r: DbReminder,
  now: Date,
  alreadyTriggered: boolean
): boolean {
  const hour =
    r.hour ?? (r.time ? Number(r.time.split(":")[0]) : null);

  const minute =
    r.minute ?? (r.time ? Number(r.time.split(":")[1]) : null);

  if (hour == null || minute == null) return false;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const reminderMinutes = hour * 60 + minute;

  /**
   * Mapeamento seguro de dias
   */
  const WEEK_MAP = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
  const today = WEEK_MAP[now.getDay()];

  const matchesDay = !r.days || r.days.includes(today);

  /**
   * Janela de disparo (1 minuto)
   */
  const diff = nowMinutes - reminderMinutes;

// janela real: 0 até 1 minuto
  const isInWindow = diff >= 0 && diff <= 1;

  // evita múltiplos disparos no mesmo minuto
  const minuteKey = `${r.id}-${now.getHours()}-${now.getMinutes()}`;

  return (
    (r.active ?? r.enabled ?? false) &&
    matchesDay &&
    isInWindow &&
    !alreadyTriggered &&
    !globalThis.__triggerCache?.has(minuteKey)
  );
}
