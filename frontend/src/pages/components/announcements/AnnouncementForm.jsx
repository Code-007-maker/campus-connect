// src/components/announcements/AnnouncementForm.jsx
import React, { useState } from "react";

export default function AnnouncementForm({ onSubmit }) {
  const [form, setForm] = useState({ title: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.message) return;
    onSubmit?.(form);
    setForm({ title: "", message: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/30 backdrop-blur p-5 rounded-2xl border border-white/30 shadow-md">
      <div className="grid grid-cols-1 gap-3">
        <input className="p-3 rounded-lg border focus:ring-4 focus:ring-indigo-200 outline-none" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="p-3 rounded-lg border focus:ring-4 focus:ring-indigo-200 outline-none h-28" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <div className="flex justify-end">
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow hover:scale-[1.02] transition">Post Announcement</button>
        </div>
      </div>
    </form>
  );
}
