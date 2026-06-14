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
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">

      {/* ================= TOP BAR ================= */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">

        {/* LOGO */}
        <Link to="/" className="text-xl font-bold text-primary-600">
          SkillLink
        </Link>

        {/* AUTH ACTIONS */}
        <div className="flex items-center gap-2">

          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>

              <Link
                to="/register"
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <span className="hidden sm:inline text-sm text-slate-500">
                {user.name} ({user.role})
              </span>

              <button
                onClick={handleLogout}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ================= DASHBOARD NAV ================= */}
      {isAuthenticated && (
        <div className="border-t bg-slate-50">
          <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6">

            {/* COMMON */}
            <NavLink to="/skills" className={navLinkClass}>
              Skills
            </NavLink>

            <NavLink to={getDashboardPath(user.role)} className={navLinkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>

            <NavLink to="/analytics" className={navLinkClass}>
              Analytics
            </NavLink>

            {/* AI CHAT (FIXED ROUTE) */}
            <NavLink
              to="/ai-chat"
              className="rounded-md bg-green-100 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-200"
            >
              AI Chat
            </NavLink>

            {/* LEARNER ONLY */}
            {user.role === 'learner' && (
              <>
                <NavLink to="/learner/matches" className={navLinkClass}>
                  Matches
                </NavLink>

                <NavLink to="/learner/schedule" className={navLinkClass}>
                  Schedule
                </NavLink>

                <NavLink
                  to="/quiz"
                  className="rounded-md bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-200"
                >
                  AI Quiz
                </NavLink>
              </>
            )}

            {/* MENTOR ONLY */}
            {user.role === 'mentor' && (
              <>
                <NavLink to="/mentor/schedule" className={navLinkClass}>
                  Schedule
                </NavLink>

                <NavLink to="/mentor/chats" className={navLinkClass}>
                  Chats
                </NavLink>
              </>
            )}

          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;