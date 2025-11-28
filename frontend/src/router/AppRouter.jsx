// src/router/AppRouter.jsx
import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/ui/Navbar.jsx";
import Sidebar from "../components/ui/Sidebar.jsx";

/*
  Lazy load pages for faster bundle & nicer dev HMR
  (explicit .jsx to avoid resolution issues on some systems)
*/
const Dashboard = lazy(() => import("../pages/Dashboard.jsx"));
const Announcements = lazy(() => import("../pages/Announcements.jsx"));
const Resources = lazy(() => import("../pages/Resources.jsx"));
const Calendar = lazy(() => import("../pages/Calendar.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const Register = lazy(() => import("../pages/Register.jsx"));
const Chats = lazy(() => import("../pages/Chats.jsx"));
const Matchmaking = lazy(() => import("../pages/Matchmaking.jsx"));
const Leaderboard = lazy(() => import("../pages/Leaderboard.jsx"));

/* ---------------------------------------------------------
   Tiny polished Loader displayed during lazy-loading
   Tailwind + CSS vars used for gradient and motion
   --------------------------------------------------------- */
function Loader({ label = "Loading..." }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex items-center gap-4">
        <div
          aria-hidden
          className="w-12 h-12 rounded-full animate-spin-slow"
          style={{
            background:
              "conic-gradient(var(--accent-start), var(--accent-mid), var(--accent-end))",
            boxShadow: "0 6px 24px rgba(15,23,42,0.08)",
          }}
        />
        <div className="text-slate-600">{label}</div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ScrollToTop on route changes (smooth)
   --------------------------------------------------------- */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [pathname]);
  return null;
};

/* ---------------------------------------------------------
   AppLayout: shared layout for protected pages
   - Top navbar + optional left sidebar
   - Main content area uses CSS route-enter animation
   --------------------------------------------------------- */
function AppLayout({ children }) {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full py-10">
          {/* Sidebar column (hidden on small screens) */}
          

          {/* Main column */}
          <main
            key={location.pathname}
            className="col-span-12 lg:col-span-9 transition-transform duration-450 ease-[cubic-bezier(.2,.9,.2,1)] animate-route-in"
            aria-live="polite"
          >
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border" style={{ borderColor: "var(--glass-border)" }}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ProtectedRoute: role based guard
   - allowed: array of roles (["student","faculty","admin"])
   - if no user -> redirect to /login
   - if role mismatch -> redirect to /
   --------------------------------------------------------- */
const ProtectedRoute = ({ children, allowed }) => {
  const { user } = useAuth() || {};
  if (!user) return <Navigate to="/login" replace />;

  if (allowed && !allowed.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/* ---------------------------------------------------------
   AppRouter: routes with Suspense + loader + protection
   --------------------------------------------------------- */
export default function AppRouter() {
  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<PublicFrame><Login /></PublicFrame>} />
          <Route path="/register" element={<PublicFrame><Register /></PublicFrame>} />

          {/* Chats - allow deep links */}
          <Route path="/chats" element={<Chats />} />
          <Route path="/chats/:id" element={<Chats />} />

          {/* Protected App area (wrapped by AppLayout) */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowed={["student", "faculty", "admin"]}>
                <AppLayout><Dashboard /></AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/announcements"
            element={
              <ProtectedRoute allowed={["student", "faculty", "admin"]}>
                <AppLayout><Announcements /></AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/matchmaking"
            element={
              <ProtectedRoute allowed={["student", "faculty", "admin"]}>
                <AppLayout><Matchmaking /></AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/resources"
            element={
              <ProtectedRoute allowed={["student", "faculty", "admin"]}>
                <AppLayout><Resources /></AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/calendar"
            element={
              <ProtectedRoute allowed={["student", "faculty", "admin"]}>
                <AppLayout><Calendar /></AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute allowed={["student", "faculty", "admin"]}>
                <AppLayout><Leaderboard /></AppLayout>
              </ProtectedRoute>
            }
          />

          {/* final fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

/* ---------------------------------------------------------
   PublicFrame: nice wrapper for login/register that keeps
   global navbar + small hero and centers the card.
   Use advanced Tailwind to make auth screens pro-grade.
   --------------------------------------------------------- */
function PublicFrame({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">

      <div className="flex-1 grid place-items-center ">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-2xl border" style={{ borderColor: "var(--glass-border)" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
