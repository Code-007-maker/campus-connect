// src/components/chats/MessageItem.jsx
import React from "react";
import { chatService } from "../../services/chat.service";
import { xpService } from "../../services/xp.service";
import { useAuth } from "../../hooks/useAuth";

export default function MessageItem({ msg, channelId }) {
  const { user } = useAuth() || {};

  const react = async (reaction) => {
    await chatService.reactMessage(channelId, msg.id, user?.name || "Anon", reaction);
    // small XP to reactor (optional)
    xpService.award(user?.name || "anon", "post_message", 1);
  };

  const time = new Date(msg.ts).toLocaleTimeString();

  return (
    <div className="p-3 rounded-lg hover:shadow-lg transition bg-white/95 border" style={{ borderColor:"var(--glass-border)" }}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-md flex items-center justify-center text-white font-semibold" style={{ background:"linear-gradient(90deg,var(--accent-start),var(--accent-mid))" }}>
          { (msg.author||"?").slice(0,1).toUpperCase() }
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-deep">{msg.author}</div>
              <div className="text-xs muted">{time}</div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={()=>react("👍")} className="px-2 py-1 text-sm rounded-md border hover:bg-slate-50">👍 {Object.keys(msg.meta?.reactions||{}).reduce((acc, r) => acc + (msg.meta?.reactions[r]?.length||0), 0)}</button>
            </div>
          </div>

          <div className="mt-2 text-sm">{msg.text}</div>

          {msg.attachments && msg.attachments.length>0 && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {msg.attachments.map((a, i) => <img key={i} src={a} alt="attachment" className="w-full rounded-md" />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
