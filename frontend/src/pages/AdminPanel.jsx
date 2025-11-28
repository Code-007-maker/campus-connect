// src/pages/AdminPanel.jsx
import React, { useState } from "react";
import { resourceService } from "../services/resource.service";
import { calendarService } from "../services/calendar.service";

export default function AdminPanel() {
  const [rname, setRname] = useState("");
  const [rloc, setRloc] = useState("");
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const createResource = async () => {
    if (!rname) return alert("Enter name");
    try {
      await resourceService.create({ name: rname, location: rloc, type: "Custom", available: true });
      alert("Resource created (demo)");
      setRname(""); setRloc("");
    } catch {
      alert("Failed to create resource");
    }
  };

  const createEvent = async () => {
    if (!title) return alert("Enter title");
    try {
      await calendarService.create({ title, start, end });
      alert("Event created (demo)");
      setTitle(""); setStart(""); setEnd("");
    } catch {
      alert("Failed to create event");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-extrabold mb-6">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/30 p-6 rounded-2xl border border-white/30 shadow">
          <h3 className="font-semibold mb-3">Create Resource</h3>
          <input placeholder="Name" value={rname} onChange={(e) => setRname(e.target.value)} className="w-full p-3 mb-2 rounded border" />
          <input placeholder="Location" value={rloc} onChange={(e) => setRloc(e.target.value)} className="w-full p-3 mb-2 rounded border" />
          <div className="text-right"><button onClick={createResource} className="px-4 py-2 rounded bg-gradient-to-r from-green-500 to-emerald-600 text-white">Create</button></div>
        </div>

        <div className="bg-white/30 p-6 rounded-2xl border border-white/30 shadow">
          <h3 className="font-semibold mb-3">Create Event</h3>
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 mb-2 rounded border" />
          <label className="block text-sm text-gray-600">Start</label>
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className="w-full p-3 mb-2 rounded border" />
          <label className="block text-sm text-gray-600">End</label>
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full p-3 mb-2 rounded border" />
          <div className="text-right"><button onClick={createEvent} className="px-4 py-2 rounded bg-gradient-to-r from-indigo-600 to-pink-600 text-white">Create Event</button></div>
        </div>
      </div>
    </div>
  );
}
