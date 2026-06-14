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
      <div className="flex justify-between items-start gap-4 flex-wrap">

        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.name}
          </h1>
        </div>

        <div className="flex gap-3 items-center">
          <NotificationBell />

          <Link
            to="/mentor/requests"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Requests
          </Link>

          <button
            onClick={handleLogout}
            className="border px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <Link className="border p-6 rounded" to="/mentor/schedule">
          Manage Schedule
        </Link>

        <Link className="border p-6 rounded" to="/mentor/chats">
          💬 Active Chats
        </Link>

        <Link className="border p-6 rounded" to="/profile">
          Profile
        </Link>

      </div>
    </section>
  );
}

export default MentorDashboard;