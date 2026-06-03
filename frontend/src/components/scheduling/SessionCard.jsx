import { Link } from 'react-router-dom';

import {
  formatSessionTimeRange,
  getReminderLabel,
  REMINDER_OPTIONS,
} from '../../utils/datetime.js';

function SessionCard({
  session,
  role,
  onReminderChange,
  onCancel,
  updating,
}) {
  const partner =
    role === 'learner'
      ? session.mentor?.name
      : session.learner?.name;

  const partnerLabel =
    role === 'learner'
      ? 'Mentor'
      : 'Learner';

  const roomName = `SkillLink-${session._id}`;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">
            {session.topic}
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            {formatSessionTimeRange(
              session.startTime,
              session.endTime
            )}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {partnerLabel}:{' '}
            <span className="font-medium text-slate-700">
              {partner}
            </span>
          </p>

          <p className="mt-1 text-xs text-primary-600">
            Meeting Room: {roomName}
          </p>
        </div>

        <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
          Upcoming
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-slate-100 pt-4">
        <div className="min-w-[180px] flex-1">
          <label
            htmlFor={`reminder-${session._id}`}
            className="block text-xs font-medium text-slate-600"
          >
            Reminder
          </label>

          <select
            id={`reminder-${session._id}`}
            value={session.reminderMinutes}
            disabled={updating}
            onChange={(e) =>
              onReminderChange(
                session._id,
                Number(e.target.value)
              )
            }
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {REMINDER_OPTIONS.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {session.reminderMinutes > 0 && (
          <p className="text-xs text-slate-500">
            {getReminderLabel(
              session.reminderMinutes
            )}
          </p>
        )}

        <Link
          to="/meeting"
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          {role === 'mentor'
            ? 'Start Meeting'
            : 'Join Meeting'}
        </Link>

        <button
          type="button"
          onClick={() => onCancel(session._id)}
          className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Cancel
        </button>
      </div>
    </article>
  );
}

export default SessionCard;