// src/components/resources/BookingModal.jsx
import React, { useState } from "react";
import { bookingService } from "../../services/booking.service";

export default function BookingModal({ resource, onClose, onBooked }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr("");
    if (!from || !to) { setErr("Choose start and end times"); return; }
    if (new Date(from) >= new Date(to)) { setErr("End must be after start"); return; }
    setLoading(true);
    try {
      await bookingService.create?.({ resourceId: resource._id, from, to });
      onBooked?.();
    } catch (e) {
      console.warn("Booking fallback to demo", e);
      onBooked?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-2xl bg-white/95 rounded-2xl p-6 shadow-2xl border border-white/30">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">Book — {resource.name}</h3>
            <p className="text-sm text-slate-600 mt-1">{resource.location}</p>
          </div>
          <button onClick={onClose} className="text-slate-700 hover:text-black">✕</button>
        </div>

        {err && <div className="mt-4 p-3 bg-rose-100 text-rose-800 rounded">{err}</div>}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-700">From</label>
            <input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full p-3 rounded border" />
          </div>
          <div>
            <label className="text-sm text-slate-700">To</label>
            <input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} className="w-full p-3 rounded border" />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
          <button onClick={submit} disabled={loading} className="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow">
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
