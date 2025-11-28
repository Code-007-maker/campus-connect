// src/components/chats/PresenceBar.jsx
import React, { useEffect, useState } from "react";
import { chatService } from "../../services/chat.service";

function isOnline(ts){
  if(!ts) return false;
  return (Date.now() - ts) < (1000 * 60 * 5); // considered online if active in last 5 min
}

export default function PresenceBar() {
  const [presence, setPresence] = useState({});

  useEffect(()=> {
    const load = () => setPresence(chatService.getPresence());
    load();
    if(!window.__campus_bus) window.__campus_bus = document.createElement("div");
    const handler = (e) => load();
    window.__campus_bus.addEventListener("chat:user:presence", handler);
    return ()=> window.__campus_bus.removeEventListener("chat:user:presence", handler);
  }, []);

  const users = Object.keys(presence);

  return (
    <div className="flex items-center gap-3 text-sm muted">
      <div className="font-semibold">Online:</div>
      <div className="flex items-center gap-2">
        {users.length===0 ? <span className="text-xs muted">No one online</span> : users.map(u => (
          <div key={u} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOnline(presence[u]) ? "bg-emerald-400 animate-pulse" : "bg-gray-300"}`}></div>
            <div className="text-xs">{u}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
