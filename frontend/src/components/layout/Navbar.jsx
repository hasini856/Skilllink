import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getDashboardPath } from '../../utils/auth.js';

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-primary-100 text-primary-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="text-xl font-bold text-primary-600">
          SkillLink
        </Link>

        <div className="flex items-center gap-1">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/skills" className={navLinkClass}>
                Skills
              </NavLink>

              <NavLink
                to={getDashboardPath(user.role)}
                className={navLinkClass}
              >
                Dashboard
              </NavLink>

              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>

              <NavLink to="/analytics" className={navLinkClass}>
                Analytics
              </NavLink>

              {/* LEARNER NAVIGATION */}
              {user.role === 'learner' && (
                <>
                  <NavLink
                    to="/learner/matches"
                    className={navLinkClass}
                  >
                    Matches
                  </NavLink>

                  <NavLink
                    to="/learner/schedule"
                    className={navLinkClass}
                  >
                    Schedule
                  </NavLink>

                  <NavLink
                    to="/quiz"
                    className="rounded-md bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-200"
                  >
                    AI Quiz
                  </NavLink>
                </>
              )}

              {/* MENTOR NAVIGATION */}
              {user.role === 'mentor' && (
                <NavLink
                  to="/mentor/schedule"
                  className={navLinkClass}
                >
                  Schedule
                </NavLink>
              )}

              <span className="hidden px-2 text-sm text-slate-500 sm:inline">
                {user.name} ({user.role})
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="ml-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>

              <Link
                to="/register"
                className="ml-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;