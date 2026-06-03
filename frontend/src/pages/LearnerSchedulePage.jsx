import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SlotCard from "../components/scheduling/SlotCard.jsx";
import UpcomingSessions from "../components/scheduling/UpcomingSessions.jsx";

import { api } from "../services/api.js";

function LearnerSchedulePage() {
  const [slots, setSlots] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [bookingId, setBookingId] =
    useState(null);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] =
    useState("");

  // =========================
  // LOAD DATA
  // =========================
  const loadData = useCallback(async () => {
    setLoading(true);

    setError("");

    try {
      const [slotsData, sessionsData] =
        await Promise.all([
          api.getAvailableSlots(),
          api.getSessions(),
        ]);

      setSlots(
        slotsData?.slots ||
          slotsData ||
          []
      );

      setSessions(
        sessionsData?.sessions ||
          sessionsData ||
          []
      );

    } catch (err) {
      setError(
        err.message ||
          "Failed to load schedule"
      );

    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // LOAD
  // =========================
  useEffect(() => {
    loadData();
  }, [loadData]);

  // =========================
  // BOOK SLOT
  // =========================
  const handleBook = async (slotId) => {
    setBookingId(slotId);

    setError("");

    setSuccess("");

    try {
      await api.bookSlot(slotId, {
        reminderMinutes: 60,
      });

      setSuccess(
        "Session booked successfully!"
      );

      await loadData();

    } catch (err) {
      setError(
        err.message ||
          "Failed to book slot"
      );

    } finally {
      setBookingId(null);
    }
  };

  // =========================
  // UPDATE REMINDER
  // =========================
  const handleReminderChange = async (
    sessionId,
    reminderMinutes
  ) => {
    setUpdatingId(sessionId);

    try {
      await api.updateSessionReminder(
        sessionId,
        {
          reminderMinutes,
        }
      );

      await loadData();

    } catch (err) {
      setError(
        err.message ||
          "Failed to update reminder"
      );

    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // CANCEL SESSION
  // =========================
  const handleCancel = async (
    sessionId
  ) => {
    if (
      !window.confirm(
        "Cancel this session?"
      )
    )
      return;

    try {
      await api.cancelSession(sessionId);

      await loadData();

    } catch (err) {
      setError(
        err.message ||
          "Failed to cancel session"
      );
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-slate-500">
          Loading schedule...
        </p>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================
  return (
    <section className="p-4">

      {/* HEADER */}
      <div className="mb-6 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Book a session
          </h1>

          <p className="text-slate-600">
            Browse mentor availability and
            schedule sessions.
          </p>
        </div>

        <Link
          to="/learner/dashboard"
          className="text-blue-600"
        >
          Back
        </Link>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-3 rounded-lg bg-red-50 p-3 text-red-600">
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="mb-3 rounded-lg bg-green-50 p-3 text-green-600">
          {success}
        </div>
      )}

      {/* NEXT SESSION */}
      {sessions.length > 0 && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <h3 className="text-lg font-bold text-green-700">
            📅 Next Meet Scheduled
          </h3>

          <p className="mt-2 text-sm text-green-600">
            You have {sessions.length}
            upcoming session
            {sessions.length > 1
              ? "s"
              : ""}
            .
          </p>
        </div>
      )}

      {/* AVAILABLE SLOTS */}
      <h2 className="text-lg font-semibold">
        Available Slots
      </h2>

      {Array.isArray(slots) &&
      slots.length === 0 ? (
        <p className="mt-4 text-gray-500">
          No slots available
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {(Array.isArray(slots)
            ? slots
            : []
          ).map((slot) => (
            <SlotCard
              key={slot._id}
              slot={slot}
            >
              <button
                onClick={() =>
                  handleBook(slot._id)
                }
                disabled={
                  bookingId === slot._id
                }
                className="mt-2 w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {bookingId === slot._id
                  ? "Booking..."
                  : "Book"}
              </button>
            </SlotCard>
          ))}

        </div>
      )}

      {/* UPCOMING SESSIONS */}
      <h2 className="mt-10 text-lg font-semibold">
        Upcoming Sessions
      </h2>

      <UpcomingSessions
        sessions={sessions}
        role="learner"
        onReminderChange={
          handleReminderChange
        }
        onCancel={handleCancel}
        updatingId={updatingId}
      />

      {/* JOIN MEETING */}
      {sessions.length > 0 && (
        <div className="mt-6">
          <Link
            to="/meeting"
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Join Meeting
          </Link>
        </div>
      )}

    </section>
  );
}

export default LearnerSchedulePage;