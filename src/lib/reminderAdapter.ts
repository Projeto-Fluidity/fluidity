/**
 * ============================================================
 * REMINDER ADAPTER
 * ============================================================
 *
 * Responsável por:
 * - Traduzir modelo do banco → modelo da UI
 * - Garantir compatibilidade com modelo antigo (hour/minute)
 * - Preparar base para novo modelo (time, days, active)
 *
 * REGRA:
 * - Aqui é o ÚNICO lugar que conhece ambos os modelos
 * ============================================================
 */

type DbReminder = {
  id: string;

  // modelo antigo
  hour: number | null;
  minute: number | null;
  enabled: boolean | null;

  // modelo novo
  time: string | null;
  label: string | null;
  days: string[] | null;
  active: boolean | null;
};

type UiReminder = {
  id: string;
  title: string;
  description: string;
  time: string;
  variant: "emotion" | "warning" | "info" | "relax";
};

/**
 * ============================================================
 * UTIL: extrair hora/minuto (dual mode)
 * ============================================================
 */
function parseTime(r: DbReminder) {
  const hour =
    r.hour ?? (r.time ? Number(r.time.split(":")[0]) : null);

  const minute =
    r.minute ?? (r.time ? Number(r.time.split(":")[1]) : null);

  return { hour, minute };
}

/**
 * ============================================================
 * UTIL: status ativo (compatível)
 * ============================================================
 */
function isActive(r: DbReminder) {
  return r.active ?? r.enabled ?? false;
}

/**
 * ============================================================
 * DB → UI
 * ============================================================
 */
export function toUiReminder(r: DbReminder): UiReminder | null {
  const { hour, minute } = parseTime(r);

  /**
   * Segurança: ignora dados inválidos
   */
  if (hour == null || minute == null) return null;

  return {
    id: r.id,
    title: r.label ?? "Hora do check-in",
    description: "Como você está se sentindo agora?",
    time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    variant: "info",
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
  const { hour, minute } = parseTime(r);

  if (hour == null || minute == null) return false;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const reminderMinutes = hour * 60 + minute;

  const today = now
    .toLocaleDateString("pt-BR", { weekday: "short" })
    .toLowerCase()
    .slice(0, 3);

  const matchesDay = !r.days || r.days.includes(today);

  return (
    isActive(r) &&
    matchesDay &&
    nowMinutes >= reminderMinutes &&
    !alreadyTriggered
  );
}
