// src/pages/admin/ManageStudents.jsx
import React, { useState } from "react";

const DEMO = [
  { id: "s1", name: "Anki Sharma", roll: "2023CS101", dept: "CSE", year: 2, status: "active" },
  { id: "s2", name: "Riya Verma", roll: "2022AS204", dept: "Astronomy", year: 3, status: "blocked" },
];

export default function ManageStudents(){
  const [list] = useState(DEMO);
  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-4">Manage Students</h1>
      <p className="muted mb-6">Add / block / view student profiles and bulk actions.</p>

      <div className="bg-white rounded-2xl shadow border p-4" style={{ borderColor: "var(--glass-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-slate-500 border-b">
                <th className="py-3">Name</th>
                <th>Roll</th>
                <th>Department</th>
                <th>Year</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {list.map(s => (
                <tr key={s.id} className="border-b last:border-b-0">
                  <td className="py-3">{s.name}</td>
                  <td>{s.roll}</td>
                  <td>{s.dept}</td>
                  <td>{s.year}</td>
                  <td>{s.status}</td>
                  <td className="text-right">
                    <button className="px-3 py-1 rounded border mr-2">Edit</button>
                    <button className="px-3 py-1 rounded bg-rose-50 text-rose-600">Block</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
