/**
 * Formata uma data para exibir
 * dia da semana e data no padrão brasileiro.
 */
export function formatDate(date: string) {
  const d = new Date(date);

  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });
}

/**
 * Formata apenas o horário.
 */
export function formatTime(date: string) {
  const d = new Date(date);

  return d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
