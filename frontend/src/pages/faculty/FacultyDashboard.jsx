// src/pages/faculty/FacultyDashboard.jsx
import React from "react";

export default function FacultyDashboard() {
  return (
    <div className="animate-fade-in space-y-6">
      <header>
        <h1 className="text-4xl font-extrabold text-slate-900">Faculty Dashboard</h1>
        <p className="text-slate-600">Manage your classes, announcements and resources.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 bg-white shadow hover:shadow-2xl transition transform hover:-translate-y-1 border">
          <div className="text-xs text-slate-500">My Classes</div>
          <div className="text-2xl font-bold mt-2">3</div>
          <p className="text-sm text-slate-500 mt-2">Active courses this semester</p>
        </div>

        <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg transform hover:scale-102 transition">
          <div className="text-xs">Announcements</div>
          <div className="text-2xl font-bold mt-2">Create</div>
          <p className="text-sm mt-2 opacity-90">Notify students quickly</p>
        </div>

        <div className="rounded-2xl p-6 bg-white shadow hover:shadow-2xl transition transform hover:-translate-y-1 border">
          <div className="text-xs text-slate-500">Attendance Tools</div>
          <div className="text-2xl font-bold mt-2">Take</div>
          <p className="text-sm text-slate-500 mt-2">Manage roll & stats</p>
        </div>
      </div>
    </div>
  );
}
