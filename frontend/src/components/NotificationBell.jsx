import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../services/api.js";
import { Link } from "react-router-dom";

const BASE_URL = "http://localhost:5000";

// ✅ FIXED SOCKET (NO localhost)
const socket = io(BASE_URL, {
  withCredentials: true,
});

function NotificationBell() {
  const [requests, setRequests] = useState([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const data = await api.getMyRequests();
    setRequests(data?.requests || []);
  };

  useEffect(() => {
    load();

    const userId = localStorage.getItem("userId");

    if (userId) socket.emit("join", userId);

    socket.on("new-session-request", () => {
      load();
    });

    return () => {
      socket.off("new-session-request");
    };
  }, []);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>
        🔔 {requests.filter((r) => r.status === "pending").length}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow p-3">
          <Link to="/mentor/requests" className="text-blue-600 text-sm">
            View All
          </Link>

          {requests.map((r) => (
            <div key={r._id} className="p-2 border-b">
              <p className="font-bold">{r.learner?.name}</p>
              <p className="text-sm">{r.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;