import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UpcomingSessions from '../components/scheduling/UpcomingSessions.jsx';
import { api } from '../services/api.js';
import { formatSessionTimeRange } from '../utils/datetime.js';

const inputClass =
  'mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500';

function MentorSchedulePage() {
  const [slots, setSlots] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState({
    topic: '',
    startTime: '',
    endTime: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [slotsRes, sessionsRes] = await Promise.all([
        api.getMySlots(),
        api.getUpcomingSessions(),
      ]);

      setSlots(slotsRes.slots ?? []);
      setSessions(sessionsRes.sessions ?? []);
    } catch (err) {
      setError(err.message || 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.createSlot({
        topic: form.topic,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      });

      setForm({
        topic: '',
        startTime: '',
        endTime: '',
      });

      setSuccess('Slot created successfully.');
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to create slot');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slotId) => {
    if (!window.confirm('Delete this slot?')) return;

    try {
      await api.deleteSlot(slotId);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete slot');
    }
  };

  const handleReminderChange = async (
    sessionId,
    reminderMinutes
  ) => {
    setUpdatingId(sessionId);

    try {
      const { session } =
        await api.updateSessionReminder(sessionId, {
          reminderMinutes,
        });

      setSessions((prev) =>
        prev.map((s) =>
          s._id === sessionId ? session : s
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to update reminder');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (sessionId) => {
    if (!window.confirm('Cancel this session?')) return;

    try {
      await api.cancelSession(sessionId);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to cancel session');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-slate-500">
          Loading schedule...
        </p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary-600">
            Scheduling
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Manage availability
          </h1>

          <p className="mt-2 text-slate-600">
            Create time slots for learners to book.
          </p>
        </div>

        <Link
          to="/mentor/dashboard"
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Back to dashboard
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          {success}
        </p>
      )}

      <form
        onSubmit={handleCreate}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="font-semibold text-slate-900">
          Create a slot
        </h2>

        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-slate-700"
            >
              Topic
            </label>

            <input
              id="topic"
              required
              value={form.topic}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  topic: e.target.value,
                }))
              }
              className={inputClass}
              placeholder="e.g. React fundamentals"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="startTime"
                className="block text-sm font-medium text-slate-700"
              >
                Start
              </label>

              <input
                id="startTime"
                type="datetime-local"
                required
                value={form.startTime}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    startTime: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="endTime"
                className="block text-sm font-medium text-slate-700"
              >
                End
              </label>

              <input
                id="endTime"
                type="datetime-local"
                required
                value={form.endTime}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    endTime: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 rounded-md bg-primary-600 px-6 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {submitting ? 'Creating...' : 'Create slot'}
        </button>
      </form>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">
          Your slots
        </h2>

        {slots.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No slots yet. Create one above.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {slots.map((slot) => (
              <li
                key={slot._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {slot.topic}
                  </p>

                  <p className="text-sm text-slate-500">
                    {formatSessionTimeRange(
                      slot.startTime,
                      slot.endTime
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      slot.status === 'available'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {slot.status}
                  </span>

                  {slot.status === 'available' && (
                    <button
                      type="button"
                      onClick={() => handleDelete(slot._id)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">
          Upcoming sessions
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Booked sessions with learners.
        </p>

        <div className="mt-4">
          <UpcomingSessions
            sessions={sessions}
            role="mentor"
            onReminderChange={handleReminderChange}
            onCancel={handleCancel}
            updatingId={updatingId}
          />

          {sessions.length > 0 && (
            <div className="mt-6">
              <Link
                to="/meeting"
                className="inline-flex rounded-md bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Start Meeting
              </Link>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}

export default MentorSchedulePage;