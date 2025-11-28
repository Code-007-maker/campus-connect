// src/components/resources/ResourceCard.jsx
import React from "react";

export default function ResourceCard({ resource, onBook = () => {} }) {
  return (
    <div className="rounded-2xl p-5 shadow-lg border border-white/30 bg-gradient-to-br from-white/80 to-white/60 hover:scale-[1.01] transition transform">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{resource.name}</h3>
          <div className="text-sm text-slate-600 mt-1">{resource.location}</div>
          <div className="text-xs text-slate-500 mt-2">{resource.description}</div>
        </div>

        <div className="ml-4 text-right">
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${resource.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {resource.available ? "Available" : "Unavailable"}
          </div>

          <div className="mt-4">
            <button onClick={onBook} disabled={!resource.available}
              className={`px-4 py-2 rounded-lg font-semibold shadow ${resource.available ? "bg-gradient-to-r from-indigo-600 to-pink-600 text-white hover:scale-[1.03]" : "bg-gray-200 text-gray-600 cursor-not-allowed"}`}>
              {resource.available ? "Book" : "Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
