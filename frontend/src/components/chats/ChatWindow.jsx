// src/components/chats/ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import { chatService } from "../../services/chat.service";
import MessageItem from "./MessageItem";
import { useAuth } from "../../hooks/useAuth.jsx";
import { xpService } from "../../services/xp.service";

export default function ChatWindow({ channelId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth() || {};
  const scroller = useRef();

  useEffect(()=> {
    if(!channelId) return;
    let mounted = true;
    (async ()=> {
      setMessages(await chatService.listMessages(channelId));
      // scroll to bottom after load
      requestAnimationFrame(()=> scroller.current?.scrollIntoView({ behavior: "smooth", block: "end" }));
    })();

    // listeners
    if(!window.__campus_bus) window.__campus_bus = document.createElement("div");
    const onMsg = (e) => { if(e.detail.channelId === channelId) setMessages(prev => [...prev, e.detail.message]); };
    const onDel = (e) => { if(e.detail.channelId === channelId) setMessages(prev => prev.filter(m=>m.id!==e.detail.messageId)); };
    const onReact = (e) => { /* could refresh if needed */ setMessages(prev => prev.map(m => m.id===e.detail.messageId ? { ...m } : m)); };
    const onTyping = (e) => { setTyping(p => ({ ...p, [e.detail.user]: Date.now() })); };

    window.__campus_bus.addEventListener("chat:message:created", onMsg);
    window.__campus_bus.addEventListener("chat:message:deleted", onDel);
    window.__campus_bus.addEventListener("chat:message:reacted", onReact);
    window.__campus_bus.addEventListener("chat:typing", onTyping);

    const presenceTicker = setInterval(() => {
      // prune typing older than 4s
      setTyping(p => Object.fromEntries(Object.entries(p).filter(([k,v]) => (Date.now()-v) < 4000)));
    }, 1000);

    return () => {
      window.__campus_bus.removeEventListener("chat:message:created", onMsg);
      window.__campus_bus.removeEventListener("chat:message:deleted", onDel);
      window.__campus_bus.removeEventListener("chat:message:reacted", onReact);
      window.__campus_bus.removeEventListener("chat:typing", onTyping);
      clearInterval(presenceTicker);
    };
  }, [channelId]);

  const send = async () => {
    if(!text.trim()) return;
    setLoading(true);
    try{
      const msg = await chatService.sendMessage(channelId, { author: user?.name || "Anon", text: text.trim() });
      // award small XP for participation
      xpService.award(user?.name || "anon", "post_message", 5);
      setText("");
      // update presence (active now)
      chatService.setPresence(user?.name);
      // scroll
      requestAnimationFrame(()=> scroller.current?.scrollIntoView({ behavior: "smooth", block: "end" }));
    }catch(e){ console.error(e); }
    setLoading(false);
  };

  const sendTyping = () => {
    if(!user) return;
    if(!window.__campus_bus) window.__campus_bus = document.createElement("div");
    window.__campus_bus.dispatchEvent(new CustomEvent("chat:typing", { detail: { user: user.name, channelId } }));
  };

  return (
    <div className="flex-1 flex flex-col h-[70vh]">
      <div className="flex-1 overflow-auto space-y-3 p-4">
        {messages.map(m => <MessageItem key={m.id} msg={m} channelId={channelId} />)}
        <div ref={scroller}></div>
      </div>

      <div className="p-4 bg-white/60 glass border-t" style={{ borderColor:"var(--glass-border)" }}>
        <div className="flex items-center gap-3">
          <input
            value={text}
            onChange={e => { setText(e.target.value); sendTyping(); }}
            onKeyDown={e => { if(e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Message the channel — Press Enter to send"
            className="flex-1 p-3 rounded-xl border"
          />
          <button onClick={send} className={`px-4 py-2 rounded-xl ${loading ? "bg-slate-200" : "btn-cta"}`}>{loading ? "Sending..." : "Send"}</button>
        </div>

        <div className="mt-2 text-xs muted">
          {Object.keys(typing).length === 0 ? null : <span className="animate-pulse">{Object.keys(typing).join(", ")} typing...</span>}
        </div>
      </div>
    </div>
  );
}
