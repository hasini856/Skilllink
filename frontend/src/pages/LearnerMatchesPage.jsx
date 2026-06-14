import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

function LearnerMatchesPage() {
  const [matches, setMatches] = useState([]);
  const [connectingId, setConnectingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await api.getMatches();
      let matchesData = res.matches || [];

      // ✅ Load pending/accepted requests to update match status
      const requestsRes = await api.getMyRequests();
      const requests = requestsRes.requests || [];
      const profileRes = await api.getProfile();
      const currentUserId = profileRes?.user?._id;

      // Enrich matches with request status and roomId from accepted requests
      matchesData = matchesData.map((match) => {
        // ✅ FIX: Check if THIS USER sent a request to THIS MATCH
        // Look for: currentUser is learner AND match is mentor
        const sentRequest = requests.find(
          (req) => req.mentor?._id === match._id && req.learner?._id === currentUserId
        );
        
        // Also check if THIS MATCH sent a request to THIS USER (reverse request)
        const receivedRequest = requests.find(
          (req) => req.learner?._id === match._id && req.mentor?._id === currentUserId
        );

        const existingRequest = sentRequest || receivedRequest;

        return {
          ...match,
          requestSent: sentRequest?.status === "pending",
          isReceiver: receivedRequest?.status === "pending",
          // ✅ Only set roomId if request is ACCEPTED
          roomId: existingRequest?.status === "accepted" ? existingRequest?.roomId : null,
        };
      });

      setMatches(matchesData);
    } catch (err) {
      console.error("Error loading matches:", err);
      setError(err.message || "Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  // ✅ FIXED CONNECT - Sends request, waits for mentor to accept
  const handleConnect = async (match) => {
    try {
      setConnectingId(match._id);
      setError(null);

      await api.sendRequest({
        mentorId: match._id,
        message: "I want to connect",
      });

      // 🔥 instant UI update
      setMatches((prev) =>
        prev.map((m) =>
          m._id === match._id
            ? { ...m, requestSent: true }
            : m
        )
      );
    } catch (err) {
      console.error("Error connecting:", err);
      
      // ✅ Handle errors
      const errorMessage = err.response?.data?.message || err.message || "Failed to send request";
      
      if (errorMessage.includes("already sent")) {
        setError("Request already sent. Waiting for mentor to accept...");
        // Reload matches to show correct status
        setTimeout(() => loadMatches(), 500);
      } else {
        setError(errorMessage);
      }
    } finally {
      setConnectingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Your Matches</h1>
        <div className="text-gray-500">Loading matches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Your Matches</h1>
        <div className="bg-red-100 text-red-700 p-3 rounded">
          Error: {error}
        </div>
        <button 
          onClick={loadMatches}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold">
        Your Matches
      </h1>

      {matches.length === 0 ? (
        <div className="mt-4 text-gray-500">
          No matches found. Make sure you have skills added to your profile.
        </div>
      ) : (
        <div className="grid gap-4 mt-4">

          {matches.map((match) => (
            <div key={match._id} className="border p-4 rounded">

              <h2 className="font-bold">
                {match.name}
              </h2>

              <p className="text-sm text-gray-600">
                {match.role}
              </p>

              {/* DISPLAY SKILL MATCH SCORE */}
              <div className="mt-2 text-sm">
                <p className="text-blue-600 font-semibold">
                  Match Score: {match.matchScore || 0}
                </p>
                {match.commonSkills && match.commonSkills.length > 0 && (
                  <p className="text-gray-600">
                    Common Skills: {match.commonSkills.join(", ")}
                  </p>
                )}
              </div>

{/* CONNECT/CHAT BUTTONS */}
            {match.roomId ? (
              <button
                onClick={() =>
                  navigate(`/chat/${match.roomId}`)
                }
                className="bg-green-600 text-white px-3 py-1 mt-3 rounded hover:bg-green-700"
              >
                Open Chat
              </button>
            ) : match.isReceiver ? (
              <p className="text-sm text-purple-600 mt-3 font-semibold">
                ⏳ This user requested to connect - pending your response
              </p>
            ) : match.requestSent ? (
              <p className="text-sm text-yellow-600 mt-3 font-semibold">
                ⏳ Waiting for mentor to accept...
              </p>
            ) : (
              <button
                onClick={() => handleConnect(match)}
                disabled={connectingId === match._id}
                className="bg-blue-600 text-white px-3 py-1 mt-3 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {connectingId === match._id
                  ? "Sending..."
                  : "Connect"}
              </button>
            )}
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default LearnerMatchesPage;