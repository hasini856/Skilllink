import {
  useEffect,
  useState,
} from "react";

import { api } from "../services/api.js";

function MentorRequestsPage() {
  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const loadRequests = async () => {
    try {
      const data =
        await api.getMyRequests();

      setRequests(
        data?.requests || []
      );

    } catch (err) {
      console.log(err);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const acceptRequest = async (
    id
  ) => {
    try {
      await api.acceptRequest(id);

      await loadRequests();

    } catch (err) {
      console.log(err);
    }
  };

  const rejectRequest = async (
    id
  ) => {
    try {
      await api.rejectRequest(id);

      await loadRequests();

    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading requests...
      </div>
    );
  }

  return (
    <section className="p-6">

      <h1 className="mb-6 text-2xl font-bold">
        Mentorship Requests
      </h1>

      <div className="space-y-4">

        {requests.length === 0 && (
          <p>No requests found</p>
        )}

        {requests.map((request) => (
          <div
            key={request._id}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >

            <h2 className="text-lg font-bold">
              {
                request.learner?.name
              }
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {
                request.learner?.email
              }
            </p>

            <p className="mt-3 text-sm">
              {request.message}
            </p>

            <div className="mt-4">

              <span className="rounded bg-slate-100 px-3 py-1 text-sm">
                Status:
                {" "}
                {request.status}
              </span>

            </div>

            {request.status ===
              "pending" && (
              <div className="mt-5 flex gap-3">

                <button
                  onClick={() =>
                    acceptRequest(
                      request._id
                    )
                  }
                  className="rounded bg-green-600 px-4 py-2 text-white"
                >
                  Accept
                </button>

                <button
                  onClick={() =>
                    rejectRequest(
                      request._id
                    )
                  }
                  className="rounded bg-red-600 px-4 py-2 text-white"
                >
                  Reject
                </button>

              </div>
            )}

          </div>
        ))}

      </div>
    </section>
  );
}

export default MentorRequestsPage;