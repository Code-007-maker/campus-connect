// src/components/chats/NewChannelForm.jsx
import React, { useState } from "react";
import { chatService } from "../../services/chat.service";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function NewChannelForm({ onClose, onCreated }){
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const { user } = useAuth() || {};
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    if(!name) return alert("Name required");
    setLoading(true);
    try{
      const ch = await chatService.createChannel({ name, title: title || name, createdBy: user?.name || "Anon" });
      onCreated?.(ch);
    }catch(e){ alert("Could not create"); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold">Create channel</h3>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <input className="w-full p-3 border rounded-md" placeholder="identifier (no spaces)" value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full p-3 border rounded-md" placeholder="Display title (optional)" value={title} onChange={e=>setTitle(e.target.value)} />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded-md border">Cancel</button>
            <button className="btn-cta px-4 py-2 rounded-md">{loading?"Creating...":"Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
