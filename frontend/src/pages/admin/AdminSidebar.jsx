// src/components/admin/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users/faculty", label: "Manage Faculty" },
  { to: "/admin/users/students", label: "Manage Students" },
  { to: "/admin/announcements", label: "Announcements" },
  { to: "/admin/events", label: "Events" },
  { to: "/admin/resources", label: "Resources" },
  { to: "/admin/leaderboard", label: "Leaderboard" },
  { to: "/admin/insights", label: "Insights" },
  { to: "/admin/activity", label: "Activity Logs" },
  { to: "/settings", label: "Settings" }
];

export default function AdminSidebar() {
  return (
    <aside className="w-72 sticky top-20 h-[calc(100vh-80px)] pr-4">
      <div className="rounded-2xl p-4 bg-gradient-to-b from-white/60 to-white/40 shadow-md border border-white/30 backdrop-blur">
        <div className="mb-6">
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg">AD</div>
            <div>
              <div className="font-bold text-slate-800">Admin</div>
              <div className="text-xs text-slate-500">Superuser</div>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {items.map(i => (
            <NavLink key={i.to} to={i.to} className={({isActive}) => `
              block rounded-lg px-3 py-2 text-sm font-medium transition 
              ${isActive ? "bg-indigo-600 text-white shadow-md" : "text-slate-700 hover:bg-slate-100"}
            `}>
              {i.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
