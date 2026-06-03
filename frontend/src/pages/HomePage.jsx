import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getDashboardPath } from '../utils/auth.js';

function HomePage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-600 to-indigo-800 px-6 py-16 text-center text-white shadow-lg sm:px-12 sm:py-20">
      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-100">
          Welcome to SkillLink
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Share skills. Build connections.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
          Join as a learner to discover mentors, or as a mentor to share your expertise with the
          community.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {isAuthenticated ? (
            <Link
              to={getDashboardPath(user.role)}
              className="rounded-md bg-white px-8 py-3 text-sm font-semibold text-primary-700 shadow hover:bg-primary-50"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="rounded-md bg-white px-8 py-3 text-sm font-semibold text-primary-700 shadow hover:bg-primary-50"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="rounded-md border border-white/40 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-16 grid max-w-4xl gap-6 text-left sm:grid-cols-2">
        <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
          <h2 className="text-lg font-semibold">Learner</h2>
          <p className="mt-2 text-sm text-primary-100">
            Find mentors, browse skills, and grow at your own pace.
          </p>
        </div>
        <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
          <h2 className="text-lg font-semibold">Mentor</h2>
          <p className="mt-2 text-sm text-primary-100">
            Offer your expertise, guide learners, and build your reputation.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
