// src/components/resources/BookingModal.jsx
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function BookingModal({ resource, onClose, onBooked }) {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const book = async () => {
    if (!start || !end) {
      setMsg("Please select start and end time");
      return;
    }

    setLoading(true);
    setMsg("");

    const res = await fetch(`${API}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        resourceId: resource._id,
        start,
        end
      })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMsg(data.message || "Booking failed");
      return;
    }

    onBooked();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">Book {resource.name}</h2>

        <label className="block mb-2 text-sm font-medium">Start Time</label>
        <input
          type="datetime-local"
          className="w-full mb-4 p-2 rounded border"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <label className="block mb-2 text-sm font-medium">End Time</label>
        <input
          type="datetime-local"
          className="w-full mb-4 p-2 rounded border"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        {msg && <p className="text-red-600 text-sm mb-4">{msg}</p>}

        <div className="mt-4 flex justify-end gap-3">
          <button className="px-4 py-2 border rounded" onClick={onClose}>
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded"
            onClick={book}
            disabled={loading}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
