// src/pages/admin/ManageFaculty.jsx
import React, { useState } from "react";

const DEMO = [
  { id: "f1", name: "Dr. A. Kumar", dept: "Physics", email: "akumar@uni.edu", status: "active" },
  { id: "f2", name: "Dr. S. Patel", dept: "Astronomy", email: "spatel@uni.edu", status: "active" },
];

export default function ManageFaculty(){
  const [list, setList] = useState(DEMO);
  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-4">Manage Faculty</h1>
      <p className="muted mb-6">Create, edit or suspend faculty accounts.</p>

      <div className="bg-white rounded-2xl shadow border p-4" style={{ borderColor: "var(--glass-border)" }}>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-slate-600">Total faculty: {list.length}</div>
          <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:shadow">Add Faculty</button>
        </div>

        <div className="divide-y">
          {list.map(f => (
            <div key={f.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{f.name}</div>
                <div className="text-sm text-slate-500">{f.dept} • {f.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border rounded text-sm">Edit</button>
                <button className="px-3 py-1 bg-red-50 border border-red-200 rounded text-red-600 text-sm">Suspend</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
