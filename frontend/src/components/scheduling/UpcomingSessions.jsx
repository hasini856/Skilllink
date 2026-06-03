import SessionCard from './SessionCard.jsx';

function UpcomingSessions({ sessions, role, onReminderChange, onCancel, updatingId }) {
  if (sessions.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        No upcoming sessions scheduled.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {sessions.map((session) => (
        <SessionCard
          key={session._id}
          session={session}
          role={role}
          onReminderChange={onReminderChange}
          onCancel={onCancel}
          updating={updatingId === session._id}
        />
      ))}
    </div>
  );
}

export default UpcomingSessions;
