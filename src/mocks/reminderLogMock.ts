/**
 * Mock de logs de lembretes
 */

type ReminderLog = {
  id: string;
  reminder_id: string;
  action: "accepted" | "postponed";
  created_at: string;
};

const STORAGE_KEY = "mock_reminder_logs";

/**
 * Recupera logs do localStorage
 */
export function getMockLogs(): ReminderLog[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Adiciona log persistente
 */
export function addMockLog(log: ReminderLog) {
  const logs = getMockLogs();
  logs.push(log);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

/**
 * Reset QA
 */
export function resetMockLogs() {
  localStorage.removeItem(STORAGE_KEY);
}
