import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

function MentorChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadChats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getMyRequests();
      const profileRes = await api.getProfile();
      const currentUserId = profileRes?.user?._id;

      // ✅ Filter to show only accepted chats where mentor is current user
      const accepted = (res.requests || []).filter(
        (r) => r.mentor?._id === currentUserId && r.status === "accepted" && r.roomId
      );

      setChats(accepted);
    } catch (err) {
      console.error("Error loading chats:", err);
      setError(err.message || "Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Active Chats</h1>
        <div className="text-gray-500">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Active Chats
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {chats.length === 0 && (
        <p className="text-gray-500">No active chats</p>
      )}

      {chats.map((c) => (
        <div
          key={c._id}
          className="border p-4 rounded flex justify-between items-center mb-3"
        >
          <div>
            <h2 className="font-bold">
              {c.learner?.name}
            </h2>
            <p className="text-sm text-gray-600">
              Match Score: {c.matchScore}%
            </p>
          </div>

          <button
            onClick={() =>
              navigate(`/chat/${c.roomId}`)
            }
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Open Chat
          </button>
        </div>
      ))}
    </div>
  );
}

export default MentorChats;