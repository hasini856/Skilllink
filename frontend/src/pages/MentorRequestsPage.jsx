import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

function MentorRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);
  const navigate = useNavigate();

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getMyRequests();
      
      // ✅ Filter to show only requests SENT TO this mentor
      // (where mentor is the current user and learner is the one asking)
      const profileRes = await api.getProfile();
      const currentUserId = profileRes?.user?._id;
      
      const mentorRequests = (res.requests || []).filter(
        (r) => r.mentor?._id === currentUserId && r.status === "pending"
      );
      
      setRequests(mentorRequests);
    } catch (err) {
      console.error("Error loading requests:", err);
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const acceptRequest = async (id) => {
    try {
      setAcceptingId(id);
      setError(null);
      await api.acceptRequest(id);
      await loadRequests();
    } catch (err) {
      console.error("Error accepting request:", err);
      setError(err.response?.data?.message || err.message || "Failed to accept request");
    } finally {
      setAcceptingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Mentor Requests</h1>
        <div className="text-gray-500">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Mentor Requests</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-gray-500">No pending requests</div>
      ) : (
        requests.map((r) => (
          <div key={r._id} className="border p-4 mb-3 rounded">

            <h2 className="font-bold">{r.learner?.name}</h2>

            <p className="text-sm text-gray-600">Status: {r.status}</p>

            <p className="text-sm text-blue-600">Match Score: {r.matchScore}%</p>

            {r.message && (
              <p className="text-sm text-gray-600 mt-2">Message: {r.message}</p>
            )}

            {r.status === "pending" && (
              <button 
                onClick={() => acceptRequest(r._id)}
                disabled={acceptingId === r._id}
                className="bg-green-600 text-white px-3 py-1 mt-3 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {acceptingId === r._id ? "Accepting..." : "Accept"}
              </button>
            )}

            {/* 🔥 CHAT ONLY AFTER ACCEPT + ROOM EXISTS */}
            {r.status === "accepted" && r.roomId && (
              <button
                onClick={() => navigate(`/chat/${r.roomId}`)}
                className="bg-green-600 text-white px-3 py-1 mt-3 ml-2 rounded hover:bg-green-700"
              >
                Open Chat
              </button>
            )}

          </div>
        ))
      )}
    </div>
  );
}

export default MentorRequestsPage;