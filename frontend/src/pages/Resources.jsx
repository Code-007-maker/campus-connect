// src/pages/Resources.jsx
import React, { useEffect, useState } from "react";
import ResourceCard from "./components/resources/ResourceCard";
import BookingModal from "./components/resources/BookingModal";
import Toast from "../components/ui/Toast";
import { useAuth } from "../hooks/useAuth";

export default function Resources() {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [resources, setResources] = useState([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [active, setActive] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", type: "" });

  // Fetch resources from backend
  const loadResources = async () => {
    const res = await fetch(`${API}/api/resources`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) setResources(data.resources || []);
    else setResources([]);
  };

  useEffect(() => {
    loadResources();
  }, []);

  const filtered = resources.filter(r => {
    if (type !== "All" && r.type !== type) return false;
    if (!q) return true;
    const text = `${r.name} ${r.location} ${r.description}`.toLowerCase();
    return text.includes(q.toLowerCase());
  });

  const onBookConfirmed = () => {
    setToast({
      open: true,
      message: "Booking successful!",
      type: "success"
    });
    loadResources();
    setActive(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Resources</h1>
        <p className="muted mt-1">Book rooms, lab equipment, and study spaces.</p>
      </header>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex gap-3 items-center w-full md:w-2/3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search resources..."
            className="w-full p-3 rounded-lg border"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-3 rounded-lg border"
          >
            <option>All</option>
            <option>Room</option>
            <option>Lab</option>
            <option>Equipment</option>
            <option>Book</option>
          </select>
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map(res => (
          <ResourceCard
            key={res._id}
            resource={res}
            onBook={() => setActive(res)}
          />
        ))}
      </div>

      {/* Booking Modal */}
      {active && (
        <BookingModal
          resource={active}
          onClose={() => setActive(null)}
          onBooked={onBookConfirmed}
        />
      )}

      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
}
