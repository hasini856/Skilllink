import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import NotificationBell from "../components/NotificationBell.jsx";

function MentorDashboard() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <section>

      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary-600">
            Mentor
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Welcome back, {user?.name}
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your offerings,
            connect with learners,
            and grow your mentorship profile.
          </p>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">

          {/* 🔔 NOTIFICATIONS */}
          <NotificationBell />

          {/* REQUESTS */}
          <Link
            to="/mentor/requests"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Requests
          </Link>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Log out
          </button>

        </div>
      </div>

      {/* CARDS */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* SCHEDULE */}
        <Link
          to="/mentor/schedule"
          className="rounded-lg border border-primary-200 bg-primary-50 p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md"
        >
          <h2 className="font-semibold text-primary-900">
            Manage schedule
          </h2>

          <p className="mt-2 text-sm text-primary-700">
            Create availability slots
            and view upcoming sessions.
          </p>
        </Link>

        {/* SKILLS */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">
            My skills
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Add and manage skills
            you offer to learners.
          </p>
        </div>

        {/* ANALYTICS */}
        <Link
          to="/analytics"
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">
            Analytics
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Platform insights and
            engagement trends.
          </p>
        </Link>

        {/* PROFILE */}
        <Link
          to="/profile"
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">
            My profile
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Update your expertise,
            experience, and availability.
          </p>
        </Link>

      </div>
    </section>
  );
}

export default MentorDashboard;