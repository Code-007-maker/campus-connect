// src/pages/Resources.jsx
import React, { useEffect, useState } from "react";
import ResourceCard from "../components/resources/ResourceCard";
import BookingModal from "../components/resources/BookingModal";
import Toast from "../components/ui/Toast";

/*
  Features:
  - Search and type filter (Room / Equipment / Lab)
  - Demo data prefilled
  - Book button opens modal which marks resource unavailable locally
*/

const DEMO = [
  { _id: "r1", name: "Study Room A", location: "Library — 2nd Floor", type: "Room", available: true, capacity: 6, description: "Quiet study room with whiteboard & charger ports." },
  { _id: "r2", name: "3D Printer (Ultimaker S3)", location: "Makerspace", type: "Equipment", available: true, capacity: 1, description: "High-res 3D printer (PLA/ABS). Requires training." },
  { _id: "r3", name: "CS Lab - GPU Cluster", location: "Building C - Lab 4", type: "Lab", available: true, capacity: 30, description: "Linux workstations with CUDA-enabled GPUs." },
  { _id: "r4", name: "AV Studio", location: "Media Center", type: "Lab", available: false, capacity: 4, description: "Recording and editing suite (booking required)." },
  { _id: "r5", name: "Conference Room B", location: "Admin Block", type: "Room", available: true, capacity: 12, description: "Projector, conference phone, whiteboard." }
];

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [active, setActive] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  useEffect(() => {
    // if backend available: resourceService.list().then(...) else fallback to demo
    setResources(DEMO);
  }, []);

  const filtered = resources.filter(r => {
    if (type !== "All" && r.type !== type) return false;
    if (!q) return true;
    const text = `${r.name} ${r.location} ${r.description}`.toLowerCase();
    return text.includes(q.toLowerCase());
  });

  const onBookConfirmed = (resourceId) => {
    setResources(prev => prev.map(r => r._id === resourceId ? { ...r, available: false } : r));
    setActive(null);
    setToast({ open: true, message: "Booking confirmed (demo)", type: "success" });
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Resources</h1>
        <p className="text-[var(--muted)] mt-1">Find and book rooms, lab stations and equipment. Use filters to target specific types.</p>
      </header>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex gap-3 items-center w-full md:w-2/3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search resources (room, equipment, location)" className="w-full p-3 rounded-lg border" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="p-3 rounded-lg border">
            <option>All</option>
            <option>Room</option>
            <option>Lab</option>
            <option>Equipment</option>
          </select>
        </div>

        <div className="flex gap-3 items-center">
          <div className="text-sm muted">Sort</div>
          <button onClick={() => setResources(r => [...r].sort((a,b)=>a.name.localeCompare(b.name)))} className="px-3 py-2 border rounded-md">A-Z</button>
          <button onClick={() => setResources(r => [...r].sort((a,b)=> (b.available?1:0)-(a.available?1:0) ))} className="px-3 py-2 border rounded-md">Available first</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map(res => (
          <ResourceCard key={res._id} resource={res} onBook={() => setActive(res)} />
        ))}
      </div>

      {active && <BookingModal resource={active} onClose={() => setActive(null)} onBooked={() => onBookConfirmed(active._id)} />}

      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, open: false })} />
    </div>
  );
}
