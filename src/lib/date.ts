/**
 * =========================
 * 📊 LÓGICA DE NEGÓCIO (CORE)
 * =========================
 */

export function getLocalDate(): string {
  return new Date().toLocaleDateString("en-CA");
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export function toLocalDate(date?: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-CA");
}

/**
 * =========================
 * FORMATAÇÃO (UI)
 * =========================
 */

export function formatDate(date?: string) {
  if (!date) return "";

  const d = new Date(date);

  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });
}

export function formatTime(date?: string) {
  if (!date) return "";

  const d = new Date(date);

  return d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
