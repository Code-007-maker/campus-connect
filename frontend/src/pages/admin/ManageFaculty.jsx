// src/pages/admin/ManageFaculty.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";
import AddTeacherDialog from "../components/AddTeacherDialog.jsx";

export default function ManageFaculty() {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTeachers() {
    setLoading(true);

    const res = await fetch(`${API}/api/admin/teachers`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      console.error("Error fetching teachers:", data);
      return;
    }

    setList(data.teachers || []);
  }

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-4">Manage Faculty</h1>
      <p className="muted mb-6">Add and view faculty linked to your system.</p>

      <div
        className="bg-white rounded-2xl shadow border p-4"
        style={{ borderColor: "var(--glass-border)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-slate-600">
            Total faculty: {list.length}
          </div>

          {/* Add Teacher Button (Dialog trigger) */}
          <AddTeacherDialog onSuccess={fetchTeachers} />
        </div>

        {loading ? (
          <div className="text-center py-6">Loading faculty...</div>
        ) : (
          <div className="divide-y">
            {list.map((f) => (
              <div
                key={f._id}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{f.name}</div>
                  <div className="text-sm text-slate-500">{f.email}</div>
                </div>

                {/* NO EDIT/SUSPEND — removed */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
