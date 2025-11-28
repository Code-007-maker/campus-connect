import React from "react";

export default function AnnouncementCard({ announcement }){
  const { title, message, author, createdAt } = announcement || {};
  return (
    <article tabIndex={0} className="glass p-5 rounded-2xl border card-hover" aria-labelledby={`ann-${announcement._id}-title`} style={{ borderColor:"var(--glass-border)" }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ background:"linear-gradient(90deg,var(--accent-start),var(--accent-mid))" }}>
            {(author||"A").slice(0,1).toUpperCase()}
          </div>
          <div>
            <h3 id={`ann-${announcement._id}-title`} className="text-lg font-semibold text-deep">{title}</h3>
            <div className="text-sm muted mt-1">{message}</div>
            <div className="text-xs muted mt-3">By <span className="font-medium text-deep">{author}</span> · <span className="muted">{new Date(createdAt).toLocaleString()}</span></div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button className="px-3 py-1 rounded-md border hover:bg-slate-50">Details</button>
        </div>
      </div>
    </article>
  );
}
