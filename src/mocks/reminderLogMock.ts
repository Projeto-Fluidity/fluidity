/**
 * Mock de logs de lembretes
 */

type ReminderLog = {
  id: string;
  reminder_id: string;
  action: "accepted" | "postponed";
  created_at: string;
};

let logs: ReminderLog[] = [];

/**
 * Retorna logs simulados
 */
export function getMockLogs(): ReminderLog[] {
  return logs;
}

/**
 * Adiciona log
 */
export function addMockLog(log: ReminderLog) {
  logs.push(log);
}

/**
 * Reset QA
 */
export function resetMockLogs() {
  logs = [];
}
