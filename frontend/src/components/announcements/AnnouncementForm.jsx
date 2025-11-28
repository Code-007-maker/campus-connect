import React, { useState } from "react";
import { announcementService } from "../../services/announcement.service";

export default function AnnouncementForm({ onSubmit }){
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const submit = async (e) => {
    e?.preventDefault();
    if(!title || !message) return alert("fill fields");
    const payload = { title, message, author: "Admin" };
    const created = await announcementService.create(payload);
    onSubmit?.(created);
    setTitle(""); setMessage("");
  };
  return (
    <form onSubmit={submit} className="grid gap-3">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="p-3 rounded-md border" />
      <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Message" className="p-3 rounded-md border" />
      <div className="flex justify-end">
        <button type="submit" className="btn-cta px-4 py-2 rounded-md">Post Announcement</button>
      </div>
    </form>
  );
}
