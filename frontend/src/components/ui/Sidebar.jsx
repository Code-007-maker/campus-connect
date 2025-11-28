// src/components/ui/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => `block px-4 py-2 rounded-lg ${isActive ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-700 hover:bg-slate-100"}`;

export default function Sidebar() {
  return (
    <nav className="sticky top-20">
      <div className="bg-white rounded-2xl p-4 shadow border" style={{ borderColor: "var(--glass-border)" }}>
        <div className="mb-4 text-slate-500 uppercase tracking-wide text-xs">Navigate</div>
        <ul className="space-y-2">
          <li><NavLink to="/" className={linkStyle}>Dashboard</NavLink></li>
          <li><NavLink to="/announcements" className={linkStyle}>Announcements</NavLink></li>
          <li><NavLink to="/calendar" className={linkStyle}>Calendar</NavLink></li>
          <li><NavLink to="/resources" className={linkStyle}>Resources</NavLink></li>
          <li><NavLink to="/matchmaking" className={linkStyle}>Project Matchmaking</NavLink></li>
          <li><NavLink to="/leaderboard" className={linkStyle}>Leaderboard</NavLink></li>

          <li className="mt-4 text-slate-500 uppercase tracking-wide text-xs">Admin</li>
          <li><NavLink to="/admin" className={linkStyle}>Admin Home</NavLink></li>
          <li><NavLink to="/admin/users/faculty" className={linkStyle}>Manage Faculty</NavLink></li>
          <li><NavLink to="/admin/users/students" className={linkStyle}>Manage Students</NavLink></li>
          <li><NavLink to="/admin/announcements" className={linkStyle}>Announcements (Admin)</NavLink></li>
          <li><NavLink to="/admin/insights" className={linkStyle}>Insights</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}
