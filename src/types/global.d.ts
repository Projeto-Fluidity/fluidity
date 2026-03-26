export {};

declare global {
  interface Window {
    resetRemindersMock?: () => Promise<void>;
  }
}