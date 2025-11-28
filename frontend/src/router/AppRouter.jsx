// src/router/AppRouter.jsx
import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import Navbar from "../components/ui/Navbar.jsx";
import Sidebar from "../components/ui/Sidebar.jsx";

/* Admin / Faculty direct imports (ensure files exist at these paths) */
import ManageFaculty from "../pages/admin/ManageFaculty.jsx";
import ManageStudents from "../pages/admin/ManageStudents.jsx";
import AnnouncementsAdmin from "../pages/admin/AnnouncementsAdmin.jsx";
import InsightsAdmin from "../pages/admin/InsightsAdmin.jsx";
import FacultyDashboard from "../pages/faculty/FacultyDashboard.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";

/* Lazy pages (explicit .jsx) */
const Dashboard = lazy(() => import("../pages/Dashboard.jsx")); // your existing student dashboard
const Announcements = lazy(() => import("../pages/Announcements.jsx"));
const Resources = lazy(() => import("../pages/Resources.jsx"));
const Calendar = lazy(() => import("../pages/Calendar.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const Register = lazy(() => import("../pages/Register.jsx"));
const Chats = lazy(() => import("../pages/Chats.jsx"));
const Matchmaking = lazy(() => import("../pages/Matchmaking.jsx"));
const Leaderboard = lazy(() => import("../pages/Leaderboard.jsx"));

/* Loader */
function Loader({ label = "Loading..." }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex items-center gap-4">
        <div
          aria-hidden
          className="w-12 h-12 rounded-full animate-spin-slow"
          style={{
            background: "conic-gradient(var(--accent-start), var(--accent-mid), var(--accent-end))",
            boxShadow: "0 6px 24px rgba(15,23,42,0.08)",
          }}
        />
        <div className="text-slate-600">{label}</div>
      </div>
    </div>
  );
}

/* ScrollToTop */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [pathname]);
  return null;
};

/* AppLayout: Navbar + Sidebar + content wrapper */
function AppLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="hidden lg:block lg:col-span-3">
            <Sidebar />
          </div>

          <main key={location.pathname} className="col-span-1 lg:col-span-9" aria-live="polite">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border" style={{ borderColor: "var(--glass-border)" }}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* RoleBasedDashboard uses your existing Dashboard for students */
function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "admin") return <AppLayout><AdminDashboard /></AppLayout>;
  if (user.role === "faculty") return <AppLayout><FacultyDashboard /></AppLayout>;

  // student -> use your existing Dashboard.jsx (lazy)
  return <AppLayout><Dashboard /></AppLayout>;
}

/* ProtectedRoute */
const ProtectedRoute = ({ children, allowed }) => {
  const { user } = useAuth() || {};
  if (!user) return <Navigate to="/login" replace />;

  if (allowed && !allowed.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/* PublicFrame for login/register (no global navbar) */
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

/* AppRouter */
export default function AppRouter() {
  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<PublicFrame><Login /></PublicFrame>} />
          <Route path="/register" element={<PublicFrame><Register /></PublicFrame>} />

          {/* Root - role based */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowed={["student", "faculty", "admin"]}>
                <RoleBasedDashboard />
              </ProtectedRoute>
            }
          />

          {/* Other protected routes */}
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

          {/* Chats deep links */}
          <Route
            path="/chats"
            element={
              <ProtectedRoute allowed={["student", "faculty", "admin"]}>
                <AppLayout><Chats /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats/:id"
            element={
              <ProtectedRoute allowed={["student", "faculty", "admin"]}>
                <AppLayout><Chats /></AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin tooling */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowed={["admin"]}>
                <AppLayout><AdminDashboard /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/admin/users/faculty" element={<ProtectedRoute allowed={["admin"]}><AppLayout><ManageFaculty /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/users/students" element={<ProtectedRoute allowed={["admin"]}><AppLayout><ManageStudents /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/announcements" element={<ProtectedRoute allowed={["admin"]}><AppLayout><AnnouncementsAdmin /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/insights" element={<ProtectedRoute allowed={["admin"]}><AppLayout><InsightsAdmin /></AppLayout></ProtectedRoute>} />

          {/* final fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
