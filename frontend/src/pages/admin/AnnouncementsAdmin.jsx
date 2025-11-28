// src/pages/admin/AnnouncementsAdmin.jsx
import React, { useState } from "react";

export default function AnnouncementsAdmin(){
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const create = () => {
    // demo local action: replace with API call
    alert("Announcement created (demo): " + title);
    setTitle(""); setBody("");
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-4">Create Announcement</h1>
      <div className="bg-white rounded-2xl p-6 shadow border" style={{ borderColor: "var(--glass-border)" }}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input className="w-full rounded-lg border px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Body</label>
          <textarea className="w-full rounded-lg border px-3 py-2 min-h-[120px]" value={body} onChange={e=>setBody(e.target.value)} />
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg" onClick={create}>Publish</button>
          <button className="px-4 py-2 border rounded-lg" onClick={()=>{ setTitle(""); setBody(""); }}>Reset</button>
        </div>
      </div>
    </div>
  );
}
