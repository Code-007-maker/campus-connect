import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

export default function BookingModal({ resource, onClose, onBooked }) {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submitBooking = async () => {
    setErr("");

    if (!start || !end) {
      setErr("Please select start and end time.");
      return;
    }

    if (new Date(end) <= new Date(start)) {
      setErr("End time must be later than start time.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          resourceId: resource._id,
          start,
          end
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.message || "Booking failed");
        setLoading(false);
        return;
      }

      onBooked(); // call success handler
    } catch (err) {
      setErr("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md border"
           style={{ borderColor: "var(--glass-border)" }}>
        
        <div className="text-xl font-bold mb-2">Book Resource</div>
        <div className="text-slate-600 mb-4">{resource.name}</div>

        {/* Start Time */}
        <label className="block text-sm font-medium">Start Time</label>
        <input
          type="datetime-local"
          className="w-full mt-1 p-2 border rounded-lg"
          value={start}
          onChange={e => setStart(e.target.value)}
        />

        {/* End Time */}
        <label className="block text-sm font-medium mt-4">End Time</label>
        <input
          type="datetime-local"
          className="w-full mt-1 p-2 border rounded-lg"
          value={end}
          onChange={e => setEnd(e.target.value)}
        />

        {/* Error message */}
        {err && <div className="text-sm text-red-600 mt-3">{err}</div>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={submitBooking}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {loading ? "Booking..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
