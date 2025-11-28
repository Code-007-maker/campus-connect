// src/components/forums/ThreadCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function ThreadCard({ thread, onUpdate }){
  return (
    <article className="glass p-4 rounded-2xl border card-hover flex items-start justify-between" style={{ borderColor:"var(--glass-border)" }}>
      <div>
        <Link to={`/forums/${thread._id}`} className="text-lg font-semibold text-deep hover:underline">{thread.title}</Link>
        <div className="text-sm muted mt-1">{thread.body.slice(0,160)}{thread.body.length>160?'...':''}</div>
        <div className="text-xs muted mt-2">By <span className="text-deep font-medium">{thread.author}</span> · {new Date(thread.createdAt).toLocaleString()}</div>
        <div className="mt-3 flex gap-2 flex-wrap">
          {(thread.tags||[]).map(t => <span key={t} className="px-2 py-1 rounded-md text-sm bg-slate-100">{t}</span>)}
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="text-sm font-semibold">{thread.votes || 0}▲</div>
        <div className="text-xs muted">{(thread.answers||[]).length} answers</div>
      </div>
    </article>
  );
}
