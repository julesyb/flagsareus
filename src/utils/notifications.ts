import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getSettings, saveSettings, getDayStreak, getDailyChallenge } from './storage';

// Channel for Android
const DAILY_CHANNEL_ID = 'daily-challenge';

// Notification identifier so we can cancel/replace
const DAILY_NOTIFICATION_ID = 'daily-challenge-reminder';

// Varied notification messages for retention
const REMINDER_MESSAGES = [
  { title: 'Daily Challenge is ready', body: 'A new set of 10 flags is waiting for you.' },
  { title: 'New flags today', body: 'Today\'s daily challenge just dropped.' },
  { title: 'Your daily flags await', body: 'Can you beat yesterday\'s score?' },
  { title: 'Don\'t break the streak', body: 'Keep your streak alive with today\'s challenge.' },
  { title: 'Flag That - Daily', body: '10 new flags. How many can you name?' },
];

/**
 * Configure notification behavior (shown even when app is foregrounded).
 */
export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * Request notification permissions. Returns true if granted.
 */
export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Check current permission status without prompting.
 */
export async function getPermissionStatus(): Promise<string> {
  if (Platform.OS === 'web') return 'unavailable';
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

/**
 * Set up the Android notification channel.
 */
export async function setupAndroidChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(DAILY_CHANNEL_ID, {
      name: 'Daily Challenge',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250],
      lightColor: '#E5271C',
    });
  }
}

/**
 * Pick a message based on streak context.
 */
function pickMessage(streak: number): { title: string; body: string } {
  if (streak >= 3) {
    return {
      title: 'Don\'t break the streak',
      body: `You're on a ${streak}-day streak. Keep it going!`,
    };
  }
  // Rotate through messages based on day of year
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return REMINDER_MESSAGES[dayOfYear % REMINDER_MESSAGES.length];
}

/**
 * Schedule (or reschedule) the daily challenge reminder.
 * Cancels any existing reminder first, then schedules a repeating daily notification.
 */
export async function scheduleDailyReminder(hour: number, minute: number): Promise<void> {
  if (Platform.OS === 'web') return;

  // Cancel existing
  await cancelDailyReminder();

  const streak = await getDayStreak();
  const message = pickMessage(streak);

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_NOTIFICATION_ID,
    content: {
      title: message.title,
      body: message.body,
      sound: true,
      ...(Platform.OS === 'android' ? { channelId: DAILY_CHANNEL_ID } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

/**
 * Cancel the daily challenge reminder.
 */
export async function cancelDailyReminder(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIFICATION_ID);
}

/**
 * Sync notification schedule with current settings.
 * Call on app start and whenever settings change.
 */
export async function syncNotificationSchedule(): Promise<void> {
  if (Platform.OS === 'web') return;

  const settings = await getSettings();

  if (!settings.dailyReminderEnabled) {
    await cancelDailyReminder();
    return;
  }

  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    // Permission denied, disable the setting
    await saveSettings({ ...settings, dailyReminderEnabled: false });
    await cancelDailyReminder();
    return;
  }

  await setupAndroidChannel();
  await scheduleDailyReminder(settings.reminderHour, settings.reminderMinute);
}

/**
 * Toggle daily reminder on/off. Returns the new enabled state.
 * Handles permission request when enabling.
 */
export async function toggleDailyReminder(
  enable: boolean,
  hour: number,
  minute: number,
): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  if (!enable) {
    await cancelDailyReminder();
    return false;
  }

  const hasPermission = await requestPermissions();
  if (!hasPermission) return false;

  await setupAndroidChannel();
  await scheduleDailyReminder(hour, minute);
  return true;
}
