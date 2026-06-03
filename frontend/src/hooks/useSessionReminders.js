import { useEffect } from 'react';
import { api } from '../services/api.js';
import { formatSessionTimeRange } from '../utils/datetime.js';

const firedKey = (sessionId, minutes) => `skilllink_reminder_${sessionId}_${minutes}`;

const shouldFireReminder = (session, now) => {
  if (session.reminderMinutes <= 0 || session.reminderSent) return false;
  const start = new Date(session.startTime).getTime();
  const remindAt = start - session.reminderMinutes * 60 * 1000;
  return now >= remindAt && now < start;
};

const showReminder = async (session) => {
  const title = `Upcoming session: ${session.topic}`;
  const body = formatSessionTimeRange(session.startTime, session.endTime);

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, tag: session._id });
  }

  try {
    await api.markReminderSent(session._id);
  } catch {
    // ignore — local reminder still shown
  }
};

export function useSessionReminders(isAuthenticated) {
  useEffect(() => {
    if (!isAuthenticated) return undefined;

    const checkReminders = async () => {
      try {
        const { sessions } = await api.getUpcomingSessions();
        const now = Date.now();

        for (const session of sessions) {
          if (!shouldFireReminder(session, now)) continue;
          const key = firedKey(session._id, session.reminderMinutes);
          if (sessionStorage.getItem(key)) continue;

          await showReminder(session);
          sessionStorage.setItem(key, '1');
        }
      } catch {
        // silent — user may not be logged in yet
      }
    };

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    checkReminders();
    const interval = setInterval(checkReminders, 60 * 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);
}
