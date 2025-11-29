// src/pages/admin/InsightsAdmin.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function InsightsAdmin() {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    late: 0,
    returned: 0
  });

  const loadBookings = async () => {
    const res = await fetch(`${API}/api/admin/bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) {
      setBookings(data.bookings);

      setSummary({
        total: data.bookings.length,
        active: data.bookings.filter(b => b.status === "approved").length,
        late: data.bookings.filter(b => b.status === "late").length,
        returned: data.bookings.filter(b => b.status === "returned").length,
      });
    }
  };

  const markReturned = async (id) => {
    if (!confirm("Mark this as returned?")) return;

    const res = await fetch(`${API}/api/bookings/return/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) loadBookings();
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-4">Resource Insights & Management</h1>
      <p className="muted mb-6">View bookings, handle returns, track overdue items.</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          label="Total Bookings"
          value={summary.total}
          color="bg-blue-100 text-blue-600"
        />
        <SummaryCard
          label="Active Bookings"
          value={summary.active}
          color="bg-green-100 text-green-600"
        />
        <SummaryCard
          label="Returned"
          value={summary.returned}
          color="bg-slate-100 text-slate-600"
        />
        <SummaryCard
          label="Late / Overdue"
          value={summary.late}
          color="bg-red-100 text-red-600"
        />
      </div>

      {/* Booking Table */}
      <div className="bg-white rounded-2xl p-6 shadow border" style={{ borderColor: "var(--glass-border)" }}>
        <h2 className="text-xl font-bold mb-4">All Bookings</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-3 text-left">Resource</th>
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-400">No bookings yet</td>
                </tr>
              ) : (
                bookings.map(b => (
                  <tr key={b._id} className="hover:bg-slate-50">
                    <td className="p-3">{b.resource?.name}</td>
                    <td className="p-3">{b.student?.name} ({b.student?.email})</td>
                    <td className="p-3">
                      {new Date(b.start).toLocaleString()} → <br />
                      {new Date(b.end).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={b.status} />
                    </td>

                    <td className="p-3 text-right">
                      {b.status === "approved" && (
                        <button
                          onClick={() => markReturned(b._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Mark Returned
                        </button>
                      )}

                      {b.status !== "approved" && (
                        <span className="text-slate-400 text-xs italic">No action</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* Summary Card Component */
function SummaryCard({ label, value, color }) {
  return (
    <div className={`p-5 rounded-xl shadow ${color}`}>
      <div className="text-sm">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

/* Status Badge */
function StatusBadge({ status }) {
  const styles = {
    approved: "bg-green-100 text-green-600",
    returned: "bg-slate-200 text-slate-600",
    late: "bg-red-100 text-red-600",
    pending: "bg-yellow-100 text-yellow-600"
  };

  return (
    <span className={`px-3 py-1 rounded-md text-xs font-medium ${styles[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}
