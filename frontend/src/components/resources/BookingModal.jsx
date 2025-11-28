import React, { useState } from "react";
import { resourceService } from "../../services/resource.service";

export default function BookingModal({ resource, onClose, onBooked }){
  const [from, setFrom] = useState(""); const [to, setTo] = useState(""); const [note, setNote] = useState(""); const [loading,setLoading]=useState(false);
  const submit = async () => {
    if(!from||!to) return alert("pick times");
    if(new Date(from) >= new Date(to)) return alert("invalid times");
    setLoading(true);
    try {
      await resourceService.book(resource._id, { from, to, note });
      onBooked?.(resource._id);
    } catch(e){ alert("booking failed"); }
    setLoading(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-[var(--card)] rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold">{resource.name}</h3>
            <div className="text-sm muted">{resource.location}</div>
          </div>
          <button onClick={onClose} className="text-muted">✕</button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm muted">From</label>
            <input type="datetime-local" value={from} onChange={e=>setFrom(e.target.value)} className="w-full p-3 mt-2 rounded-md border" />
          </div>
          <div>
            <label className="text-sm muted">To</label>
            <input type="datetime-local" value={to} onChange={e=>setTo(e.target.value)} className="w-full p-3 mt-2 rounded-md border" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm muted">Note</label>
          <textarea value={note} onChange={e=>setNote(e.target.value)} className="w-full p-3 mt-2 rounded-md border" />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
          <button onClick={submit} disabled={loading} className="btn-cta px-4 py-2 rounded-md">{loading?"Booking...":"Confirm Booking"}</button>
        </div>
      </div>
    </div>
  );
}
