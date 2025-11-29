// src/pages/admin/AdminDashboard.jsx
import React from "react";

export default function AdminDashboard() {
  const tiles = [
    { title: "Students", value: 1248, gradient: "from-emerald-400 to-teal-500" },
    { title: "Faculty", value: 112, gradient: "from-indigo-400 to-violet-500" },
    { title: "Announcements", value: 8, gradient: "from-yellow-400 to-orange-400" },
    { title: "Overdue Resources", value: 3, gradient: "from-rose-400 to-pink-500" }
  ];

  return (
    <div className="space-y-6 animate-fade-in dark:bg-gray-900">
      <header>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Admin Console</h1>
        <p className="text-slate-600 dark:text-white">Full control panel for the Campus Connect platform.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiles.map((t, idx) => (
          <div key={idx} className={`rounded-2xl p-5 text-white dark:text-black shadow-lg transform hover:-translate-y-1 transition bg-gradient-to-br ${t.gradient}`}>
            <div className="text-xs font-semibold">{t.title}</div>
            <div className="text-3xl font-extrabold mt-2">{t.value}</div>
          </div>
        ))}
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 dark:bg-gray-900">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow border w-full">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <ul className="space-y-3">
            <li className="p-3 rounded-lg border hover:bg-slate-50 transition">Student Arjun submitted assignment</li>
            <li className="p-3 rounded-lg border hover:bg-slate-50 transition">Faculty Dr. Asha created event</li>
          </ul>
        </div>

        
      </section>
    </div>
  );
}
