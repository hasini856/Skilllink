import { useNavigate } from "react-router-dom";

function MatchCard({
  match,
  onConnect,
  connecting,
}) {
  const navigate = useNavigate();

  const handleChat = () => {
    navigate("/chat", {
      state: {
        user: match,
        chatId: match.chatId,
      },
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* NAME */}
      <h3 className="text-lg font-bold text-slate-900">
        {match.name}
      </h3>

      {/* ROLE */}
      <p className="text-sm text-slate-500 capitalize">
        {match.role}
      </p>

      {/* SKILLS */}
      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-700">
          Skills
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {(match.skills || []).length > 0 ? (
            match.skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-400">
              No skills added
            </p>
          )}
        </div>
      </div>
{/* SHARED SKILLS */}
<div className="mt-4">
  {match.commonSkills && match.commonSkills.length > 0 ? (
    <>
      <p className="text-sm font-semibold text-green-700">
        Shared Skills
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {match.commonSkills.map((skill, index) => (
          <span
            key={index}
            className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </>
  ) : (
    <p className="mt-2 text-sm text-slate-400">
      No shared skills
    </p>
  )}
</div>
      <div className="mt-4">
        <p className="text-sm text-slate-600">
          Match Score:
          <span className="ml-2 font-bold text-primary-600">
            {match.matchScore}
          </span>
        </p>
      </div>

      {/* STATUS */}
      {match.requestStatus === "accepted" && (
        <div className="mt-4 rounded-lg bg-green-50 p-2 text-sm font-semibold text-green-700">
          ✅ Connected Successfully
        </div>
      )}

      {match.requestStatus === "pending" && (
        <div className="mt-4 rounded-lg bg-yellow-50 p-2 text-sm font-semibold text-yellow-700">
          ⏳ Request Pending
        </div>
      )}

      {match.requestStatus === "rejected" && (
        <div className="mt-4 rounded-lg bg-red-50 p-2 text-sm font-semibold text-red-700">
          ❌ Request Rejected
        </div>
      )}

      {/* BUTTONS */}
      <div className="mt-5 flex gap-2">

        {/* CONNECT */}
        {!match.requestStatus && (
          <button
            onClick={() => onConnect(match)}
            disabled={connecting}
            className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {connecting
              ? "Connecting..."
              : "Connect"}
          </button>
        )}

        {/* PENDING */}
        {match.requestStatus === "pending" && (
          <button
            disabled
            className="flex-1 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Pending
          </button>
        )}

        {/* CONNECTED */}
        {match.requestStatus === "accepted" && (
          <>
            <button
              disabled
              className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Connected
            </button>

            <button
              onClick={handleChat}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Chat
            </button>
          </>
        )}

        {/* REJECTED */}
        {match.requestStatus === "rejected" && (
          <button
            disabled
            className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Rejected
          </button>
        )}

      </div>
    </div>
  );
}

export default MatchCard;