// src/components/chats/ChannelList.jsx
import React, { useEffect, useState } from "react";
import { chatService } from "../../services/chat.service";
import NewChannelForm from "./NewChannelForm";
import { Link, useNavigate } from "react-router-dom";

export default function ChannelList({ activeChannel, onSelect }) {
  const [channels, setChannels] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const nav = useNavigate();

  useEffect(()=> {
    (async ()=> {
      setChannels(await chatService.listChannels());
    })();

    // listen for new channels
    if(!window.__campus_bus) window.__campus_bus = document.createElement("div");
    const handler = (e) => setChannels(prev => [e.detail, ...prev.filter(c=>c.id !== e.detail.id)]);
    window.__campus_bus.addEventListener("chat:channel:created", handler);
    return () => window.__campus_bus.removeEventListener("chat:channel:created", handler);
  }, []);

  return (
    <aside className=" md:w-80 p-4 bg-white/60 glass rounded-2xl border" style={{ borderColor:"var(--glass-border)" }}>
      <div className="flex items-center justify-between mb-3">
        
        <button onClick={()=>setOpenCreate(true)} className="px-2 py-1 rounded-md border text-sm">+ New</button>
      </div>

      <div className="space-y-2">
        {channels.map(ch => (
          <button key={ch.id} onClick={() => { onSelect(ch.id); nav(`/chats/${ch.id}`); }} className={`w-60 text-left p-3 rounded-lg flex items-center justify-between transition ${activeChannel===ch.id ? "bg-[linear-gradient(90deg,var(--accent-start),var(--accent-mid))] text-white" : "hover:bg-slate-50"}`}>
            <div>
              <div className={`font-medium ${activeChannel===ch.id ? "text-white" : "text-deep"}`}>{ch.title}</div>
              <div className="text-xs muted">{new Date(ch.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="text-sm muted">{/* message count placeholder */}</div>
          </button>
        ))}
      </div>

      {openCreate && <NewChannelForm onClose={()=>setOpenCreate(false)} onCreated={(c)=>{ setChannels(prev=>[c,...prev]); setOpenCreate(false); onSelect(c.id); }} />}
    </aside>
  );
}
