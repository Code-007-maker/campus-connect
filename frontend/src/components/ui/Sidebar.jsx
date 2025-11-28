// frontend/src/components/ui/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/*
  Sidebar used in AppLayout. Pure client UI (no external dependencies).
  - Advanced Tailwind: gradients, glass, subtle float animation
  - Accessible: aria attributes and keyboard focus states
*/

const NAV = [
  { to: "/", label: "Home", hint: "Overview", icon: "🏠" },
  { to: "/announcements", label: "Announcements", hint: "Campus news", icon: "📣" },
  { to: "/calendar", label: "Calendar", hint: "Events & classes", icon: "🗓️" },
  { to: "/resources", label: "Resources", hint: "Rooms & labs", icon: "🧰" },
  { to: "/matchmaking", label: "Matchmaking", hint: "Find teammates", icon: "🤝" },
  { to: "/leaderboard", label: "Leaderboard", hint: "Top contributors", icon: "🏆" },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth() || { user: "Demo Student" };

  return (
    <nav aria-label="Sidebar" className="text-sm">
      {/* profile */}
      <div
        className="glass p-4 rounded-2xl mb-6 border shadow-sm flex items-center gap-3"
        style={{ borderColor: "var(--glass-border)" }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ background: "linear-gradient(90deg,var(--accent-start),var(--accent-mid))", boxShadow: "0 8px 26px rgba(37,99,235,0.08)" }}
        >
          {user?.[0]?.toUpperCase() || "U"}
        </div>

        <div>
          <div className="font-semibold text-deep">{user?.name || user}</div>
          <div className="text-xs muted">Role: <span className="font-medium">{user?.role || "student"}</span></div>
        </div>
      </div>

      {/* quick actions */}
      <div className="mb-6">
        <div className="flex gap-3">
          <button
            className="btn-cta px-3 py-1 rounded-full text-xs shadow-sm hover:opacity-95 transition"
            aria-label="Quick book room"
          >
            Book a room
          </button>
          <Link to="/announcements" className="px-3 py-1 rounded-full bg-white border text-xs hover:shadow-sm transition" style={{ borderColor: "var(--glass-border)" }}>
            Announcements
          </Link>
        </div>
      </div>

      {/* search */}
      <div className="mb-6">
        <label htmlFor="sidebar-search" className="sr-only">Search</label>
        <div className="relative">
          <input
            id="sidebar-search"
            placeholder="Search events, resources..."
            className="w-full rounded-xl py-2 px-3 border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300"
            style={{ borderColor: "var(--glass-border)" }}
            aria-label="Search site"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">⌘K</div>
        </div>
      </div>

      {/* nav links */}
      <ul className="space-y-2">
        {NAV.map((n) => {
          const active = pathname === n.to;
          return (
            <li key={n.to}>
              <Link
                to={n.to}
                className={`flex items-center gap-3 p-3 rounded-xl transition transform hover:-translate-y-1
                  ${active ? "bg-gradient-to-r from-indigo-50 to-white border-l-4 border-indigo-400 shadow-md" : "bg-white/60"}
                `}
                aria-current={active ? "page" : undefined}
                style={{ borderColor: active ? "transparent" : "var(--glass-border)" }}
              >
                <div className={`w-9 h-9 flex items-center justify-center rounded-lg ${active ? "text-white" : "text-slate-700"}`} style={ active ? { background: "linear-gradient(90deg,var(--accent-start),var(--accent-mid))" } : { background: "rgba(250,250,250,0.9)" } }>
                  <span className="text-lg">{n.icon}</span>
                </div>

                <div className="flex-1">
                  <div className={`font-medium ${active ? "text-deep" : "text-slate-700"}`}>{n.label}</div>
                  <div className="text-xs muted">{n.hint}</div>
                </div>

                <div className="text-xs muted">{active ? "Active" : ""}</div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* small footer */}
      <div className="mt-6 text-xs muted">
        <div className="mb-2">Tips</div>
        <ul className="list-disc ml-4">
          <li>Use calendar sync in profile</li>
          <li>Earn XP for participation</li>
          <li>Keep profile up-to-date</li>
        </ul>
      </div>

      {/* floating decorative element */}
      <div className="pointer-events-none mt-6">
        <div className="w-full h-20 rounded-xl opacity-40" style={{ background: "radial-gradient(circle at 10% 20%, rgba(99,102,241,0.09), transparent 30%), radial-gradient(circle at 90% 80%, rgba(6,182,212,0.06), transparent 30%)" }} />
      </div>
    </nav>
  );
}
