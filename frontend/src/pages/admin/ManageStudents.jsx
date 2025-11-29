import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function ManageStudents() {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch student list
  async function fetchStudents() {
    setLoading(true);
    const res = await fetch(`${API}/api/admin/students`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) setStudents(data.students || []);
  }

  // Delete student
  async function deleteStudent(id) {
    const ok = confirm("Are you sure you want to delete this student?");
    if (!ok) return;

    const res = await fetch(`${API}/api/admin/students/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to delete");
      return;
    }

    alert("Student deleted successfully!");
    fetchStudents();
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-4">Manage Students</h1>

      <div className="bg-white rounded-2xl shadow border p-4">
        <div className="text-sm text-slate-600 mb-4">
          Total students: {students.length}
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="divide-y">
            {students.map((s) => (
              <div key={s._id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-slate-500">{s.email}</div>
                </div>

                <button
                  onClick={() => deleteStudent(s._id)}
                  className="px-4 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
