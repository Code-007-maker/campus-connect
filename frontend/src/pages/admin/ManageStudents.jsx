import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function ManageStudents() {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [students, setStudents] = useState([]);

  async function fetchStudents() {
    const res = await fetch(`${API}/api/admin/students`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (res.ok) setStudents(data.students);
  }

  useEffect(() => { fetchStudents(); }, []);

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-4">Manage Students</h1>

      <div className="bg-white rounded-2xl shadow border p-4">
        <div className="text-sm text-slate-600 mb-4">
          Total students: {students.length}
        </div>

        <div className="divide-y">
          {students.map(s => (
            <div key={s._id} className="py-3">
              <div className="font-semibold">{s.name}</div>
              <div className="text-sm text-slate-500">{s.email}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
