// src/components/admin/StatCard.jsx
import React from "react";

export default function StatCard({ title, value, delta, icon }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow hover:shadow-xl transition transform hover:-translate-y-1 border border-white/40">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500">{title}</div>
          <div className="text-2xl font-extrabold text-slate-800">{value}</div>
        </div>
        <div className="text-sm font-medium text-emerald-600">{delta || "+"}</div>
      </div>
    </div>
  );
}
