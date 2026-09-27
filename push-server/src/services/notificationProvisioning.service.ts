import {
  createDefaultReminderSettings,
  getReminderSettings,
} from "../repositories/reminderSettings.repository.js";
import {
  createFixedMoodReminder,
  hasFixedMoodReminder,
} from "../repositories/scheduledReminder.repository.js";

export async function provisionUserNotificationState(
  userId: string,
): Promise<void> {
  const settings = await getReminderSettings(userId);

  if (!settings) {
    await createDefaultReminderSettings(userId);
  }

  const hasMoodReminder = await hasFixedMoodReminder(userId);

  if (!hasMoodReminder) {
    await createFixedMoodReminder(userId);
  }
}
