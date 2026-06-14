import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function LearnerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <section>

      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary-600">
            Learner
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Welcome back, {user?.name}
          </h1>

          <p className="mt-2 text-slate-600">
            Explore skills, connect with mentors, and track your learning journey.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Log out
        </button>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <Link
          to="/learner/schedule"
          className="rounded-lg border border-primary-200 bg-primary-50 p-6 shadow-sm hover:shadow-md"
        >
          <h2 className="font-semibold text-primary-900">Book sessions</h2>
          <p className="mt-2 text-sm text-primary-700">
            Browse mentor slots and book sessions.
          </p>
        </Link>

        <Link
          to="/learner/matches"
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">Find matches</h2>
          <p className="mt-2 text-sm text-slate-600">
            Connect with mentors and peers.
          </p>
        </Link>

        <Link
          to="/skills"
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">Browse skills</h2>
          <p className="mt-2 text-sm text-slate-600">
            Explore learning resources and tutorials.
          </p>
        </Link>

        {/* ⭐ AI CHATBOT CARD (NEW) */}
        <Link
          to="/ai-chat"
          className="rounded-lg border border-yellow-300 bg-yellow-50 p-6 shadow-sm hover:shadow-md"
        >
          <h2 className="font-semibold text-yellow-900">
            AI Chatbot 🤖
          </h2>
          <p className="mt-2 text-sm text-yellow-700">
            Ask doubts and get instant AI answers.
          </p>
        </Link>

        <Link
          to="/quiz"
          className="rounded-lg border border-purple-200 bg-purple-50 p-6 shadow-sm hover:shadow-md"
        >
          <h2 className="font-semibold text-purple-900">
            AI Quiz Generator
          </h2>
          <p className="mt-2 text-sm text-purple-700">
            Test your knowledge instantly.
          </p>
        </Link>

        <Link
          to="/analytics"
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">Analytics</h2>
          <p className="mt-2 text-sm text-slate-600">
            View your learning insights.
          </p>
        </Link>

      </div>
    </section>
  );
}

export default LearnerDashboard;