// src/pages/admin/InsightsAdmin.jsx
import React from "react";

export default function InsightsAdmin(){
  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-4">Insights & Analytics</h1>
      <p className="muted mb-6">Demo charts & usage statistics (replace with real charts later).</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow border" style={{ borderColor: "var(--glass-border)" }}>
          <div className="text-sm text-slate-500 mb-3">Student activity (demo)</div>
          <div className="h-40 rounded-lg bg-gradient-to-r from-slate-100 to-white flex items-center justify-center text-slate-400">[Chart placeholder]</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow border" style={{ borderColor: "var(--glass-border)" }}>
          <div className="text-sm text-slate-500 mb-3">Resource demand</div>
          <div className="h-40 rounded-lg bg-gradient-to-r from-slate-100 to-white flex items-center justify-center text-slate-400">[Chart placeholder]</div>
        </div>
      </div>
    </div>
  );
}
