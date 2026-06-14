import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout.jsx";
import ProtectedRoute from "../components/auth/ProtectedRoute.jsx";
import GuestRoute from "../components/auth/GuestRoute.jsx";

// Pages
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";

import LearnerDashboard from "../pages/LearnerDashboard.jsx";
import MentorDashboard from "../pages/MentorDashboard.jsx";

import LearnerMatchesPage from "../pages/LearnerMatchesPage.jsx";

import ProfilePage from "../pages/ProfilePage.jsx";

import LearnerSchedulePage from "../pages/LearnerSchedulePage.jsx";
import MentorSchedulePage from "../pages/MentorSchedulePage.jsx";

import AnalyticsDashboardPage from "../pages/AnalyticsDashboardPage.jsx";

import VideoMeetingPage from "../pages/VideoMeetingPage.jsx";

// CHAT
import AIChat from "../pages/AIChat.jsx";
import MentorChat from "../pages/MentorChat.jsx";
import MentorChats from "../pages/MentorChats.jsx";

// OTHER
import MentorRequestsPage from "../pages/MentorRequestsPage.jsx";
import SkillsPage from "../pages/SkillsPage.jsx";
import AIQuizPage from "../pages/AIQuizPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>

        {/* HOME */}
        <Route index element={<HomePage />} />

        {/* AUTH */}
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

        {/* DASHBOARDS */}
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

        {/* AI CHAT */}
        <Route
          path="ai-chat"
          element={
            <ProtectedRoute>
              <AIChat />
            </ProtectedRoute>
          }
        />

        {/* REAL CHAT */}
        <Route
          path="chat/:roomId"
          element={
            <ProtectedRoute>
              <MentorChat />
            </ProtectedRoute>
          }
        />

        {/* 🔥 CHAT INBOX (IMPORTANT) */}
        <Route
          path="mentor/chats"
          element={
            <ProtectedRoute role="mentor">
              <MentorChats />
            </ProtectedRoute>
          }
        />

        {/* MATCHES */}
        <Route
          path="learner/matches"
          element={
            <ProtectedRoute role="learner">
              <LearnerMatchesPage />
            </ProtectedRoute>
          }
        />

        {/* OTHER */}
        <Route
          path="profile"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
        />

        <Route
          path="analytics"
          element={<ProtectedRoute><AnalyticsDashboardPage /></ProtectedRoute>}
        />

        <Route
          path="meeting"
          element={<ProtectedRoute><VideoMeetingPage /></ProtectedRoute>}
        />

        <Route
          path="skills"
          element={<ProtectedRoute><SkillsPage /></ProtectedRoute>}
        />

        <Route
          path="quiz"
          element={<ProtectedRoute><AIQuizPage /></ProtectedRoute>}
        />

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

        <Route
          path="mentor/requests"
          element={
            <ProtectedRoute role="mentor">
              <MentorRequestsPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />

      </Route>
    </Routes>
  );
}

export default AppRoutes;