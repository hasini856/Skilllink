import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import GuestRoute from '../components/auth/GuestRoute.jsx';

// Pages
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';

import LearnerDashboard from '../pages/LearnerDashboard.jsx';
import MentorDashboard from '../pages/MentorDashboard.jsx';

import LearnerMatchesPage from '../pages/LearnerMatchesPage.jsx';

import ProfilePage from '../pages/ProfilePage.jsx';

import LearnerSchedulePage from '../pages/LearnerSchedulePage.jsx';
import MentorSchedulePage from '../pages/MentorSchedulePage.jsx';

import AnalyticsDashboardPage from '../pages/AnalyticsDashboardPage.jsx';

import VideoMeetingPage from '../pages/VideoMeetingPage.jsx';

import ChatPage from '../pages/ChatPage.jsx';

import MentorRequestsPage from "../pages/MentorRequestsPage";

import NotFoundPage from '../pages/NotFoundPage.jsx';

// Skills
import SkillsPage from '../pages/SkillsPage.jsx';

// ⭐ AI QUIZ PAGE
import AIQuizPage from '../pages/AIQuizPage.jsx';

function AppRoutes() {
return (
<Routes>
<Route element={<MainLayout />}>

{/* Home */}
<Route
index
element={<HomePage />}
/>

{/* Auth */}
<Route
path="login"
element={
<GuestRoute>
<LoginPage />
</GuestRoute>
}
/>

<Route
path="register"
element={
<GuestRoute>
<RegisterPage />
</GuestRoute>
}
/>

{/* Dashboards */}
<Route
path="learner/dashboard"
element={
<ProtectedRoute role="learner">
<LearnerDashboard />
</ProtectedRoute>
}
/>

<Route
path="mentor/dashboard"
element={
<ProtectedRoute role="mentor">
<MentorDashboard />
</ProtectedRoute>
}
/>

{/* Matches */}
<Route
path="learner/matches"
element={
<ProtectedRoute role="learner">
<LearnerMatchesPage />
</ProtectedRoute>
}
/>

{/* PROFILE */}
<Route
path="profile"
element={
<ProtectedRoute>
<ProfilePage />
</ProtectedRoute>
}
/>

{/* ANALYTICS */}
<Route
path="analytics"
element={
<ProtectedRoute>
<AnalyticsDashboardPage />
</ProtectedRoute>
}
/>

{/* MEETING */}
<Route
path="meeting"
element={
<ProtectedRoute>
<VideoMeetingPage />
</ProtectedRoute>
}
/>

{/* CHAT */}
<Route
path="chat"
element={
<ProtectedRoute>
<ChatPage />
</ProtectedRoute>
}
/>

<Route
path="chat/:id"
element={
<ProtectedRoute>
<ChatPage />
</ProtectedRoute>
}
/>

{/* SKILLS */}
<Route
path="skills"
element={
<ProtectedRoute>
<SkillsPage />
</ProtectedRoute>
}
/>

{/* ⭐ AI QUIZ */}
<Route
path="quiz"
element={
<ProtectedRoute>
<AIQuizPage />
</ProtectedRoute>
}
/>

{/* SCHEDULE */}
<Route
path="learner/schedule"
element={
<ProtectedRoute role="learner">
<LearnerSchedulePage />
</ProtectedRoute>
}
/>

<Route
path="mentor/schedule"
element={
<ProtectedRoute role="mentor">
<MentorSchedulePage />
</ProtectedRoute>
}
/>

{/* REQUESTS */}
<Route
path="mentor/requests"
element={
<ProtectedRoute role="mentor">
<MentorRequestsPage />
</ProtectedRoute>
}
/>

{/* 404 */}
<Route
path="*"
element={<NotFoundPage />}
/>

</Route>
</Routes>
);
}

export default AppRoutes;