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
type="button"
onClick={handleLogout}
className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
>
Log out
</button>
</div>

<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

{/* BOOK SESSIONS */}
<Link
to="/learner/schedule"
className="rounded-lg border border-primary-200 bg-primary-50 p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md"
>
<h2 className="font-semibold text-primary-900">
Book sessions
</h2>

<p className="mt-2 text-sm text-primary-700">
Browse mentor slots, book sessions, and view upcoming meetings.
</p>
</Link>

{/* MATCHES */}
<Link
to="/learner/matches"
className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md"
>
<h2 className="font-semibold text-slate-900">
Find matches
</h2>

<p className="mt-2 text-sm text-slate-600">
Connect with peers who share your skills and mentors who can help you grow.
</p>
</Link>

{/* SKILLS */}
<Link
to="/skills"
className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md"
>
<h2 className="font-semibold text-slate-900">
Browse skills
</h2>

<p className="mt-2 text-sm text-slate-600">
Explore trending skills, learning resources, and curated tutorials.
</p>
</Link>

{/* AI QUIZ */}
<Link
to="/quiz"
className="rounded-lg border border-purple-200 bg-purple-50 p-6 shadow-sm transition hover:border-purple-300 hover:shadow-md"
>
<h2 className="font-semibold text-purple-900">
AI Quiz Generator
</h2>

<p className="mt-2 text-sm text-purple-700">
Generate AI-powered quizzes and test your knowledge instantly.
</p>
</Link>

{/* ANALYTICS */}
<Link
to="/analytics"
className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md"
>
<h2 className="font-semibold text-slate-900">
Analytics
</h2>

<p className="mt-2 text-sm text-slate-600">
View platform insights, trends, and engagement charts.
</p>
</Link>

{/* PROFILE */}
<Link
to="/profile"
className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md"
>
<h2 className="font-semibold text-slate-900">
My profile
</h2>

<p className="mt-2 text-sm text-slate-600">
Update your skills, interests, and learning goals.
</p>
</Link>

</div>
</section>
);
}

export default LearnerDashboard;