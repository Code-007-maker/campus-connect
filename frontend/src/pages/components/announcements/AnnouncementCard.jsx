// src/components/announcements/AnnouncementCard.jsx
import React from "react";

export default function AnnouncementCard({ announcement }) {
  return (
    <article className="bg-gradient-to-br from-white/70 to-white/60 backdrop-blur rounded-xl p-6 shadow-lg border border-white/30 hover:scale-[1.007] transition transform">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-slate-900">{announcement.title}</h3>
          <p className="text-slate-600 mt-2">{announcement.message}</p>
          <div className="mt-3 text-xs text-slate-500">
            {announcement.author ? `Posted by ${announcement.author}` : "Posted by Admin"} • {new Date(announcement.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="ml-6 flex items-center">
          <button className="text-indigo-600 font-medium hover:underline">Share</button>
        </div>
      </div>
    </article>
  );
}
