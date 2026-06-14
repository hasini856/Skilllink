import { useNavigate } from "react-router-dom";

function MatchCard({ match, onConnect, connecting }) {
  const navigate = useNavigate();

  const handleChat = () => {
    if (!match.roomId) {
      alert("Chat not available yet. Accept connection first.");
      return;
    }

    navigate(`/chat/${match.roomId}`, {
      state: {
        user: match,
      },
    });
  };

  return (
    <div className="rounded-xl border p-5">

      <h3 className="font-bold">{match.name}</h3>
      <p>{match.role}</p>

      <p>Score: {match.matchScore}</p>

      {/* CONNECT */}
      {!match.requestStatus && (
        <button onClick={() => onConnect(match)}>
          Connect
        </button>
      )}

      {/* CHAT ONLY IF CONNECTED */}
      {match.requestStatus === "accepted" && (
        <button onClick={handleChat}>
          Chat
        </button>
      )}
    </div>
  );
}

export default MatchCard;