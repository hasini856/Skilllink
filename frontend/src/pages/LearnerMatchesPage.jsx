import {
  useCallback,
  useEffect,
  useState,
} from "react";

import MatchCard from "../components/matches/MatchCard.jsx";

import { api } from "../services/api.js";

function MatchSection({
  title,
  description,
  matches,
  onConnect,
  connectingId,
  emptyMessage,
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-600">
        {description}
      </p>

      {matches.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          {emptyMessage}
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((match, index) => (
            <MatchCard
              key={
                match.id ||
                match._id ||
                index
              }
              match={match}
              onConnect={onConnect}
              connecting={
                connectingId ===
                (match.id ||
                  match._id ||
                  match.name)
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

function LearnerMatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] =
    useState("");

  const [connectingId, setConnectingId] =
    useState(null);

  // ================= LOAD MATCHES =================
  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);

      setError("");

      const data = await api.getMatches();

      console.log(
        "MATCH RESPONSE:",
        data
      );

      setMatches(data?.matches ?? []);

    } catch (err) {
      console.error("MATCH ERROR:", err);

      setError(
        err.message ||
          "Failed to load matches"
      );

    } finally {
      setLoading(false);
    }
  }, []);

  // ================= LOAD =================
  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  // ================= CONNECT =================
  const handleConnect = async (match) => {
    try {
      const id = match._id;

      setConnectingId(id);

      setError("");

      setSuccess("");

      await api.sendRequest({
        mentorId: match._id,
        topic: "Mentorship",
        message:
          "I'd like to connect with you",
      });

      setSuccess(
        `Connection request sent to ${match.name}`
      );

      await loadMatches();

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to send request"
      );

    } finally {
      setConnectingId(null);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-slate-500">
          Finding best matches...
        </p>
      </div>
    );
  }

  // ================= PAGE =================
  return (
    <section className="p-4">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          Your Matches
        </h1>

        <p className="text-slate-600">
          Based on your skills and profile
        </p>
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-green-700">
          {success}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {/* MATCHES */}
      <MatchSection
        title="Recommended Matches"
        description="Mentors and peers matched with your skills"
        matches={matches}
        onConnect={handleConnect}
        connectingId={connectingId}
        emptyMessage="No matches found"
      />

    </section>
  );
}

export default LearnerMatchesPage;