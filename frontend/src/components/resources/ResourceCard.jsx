import React from "react";

export default function ResourceCard({ resource, onBook }){
  return (
    <div className="p-5 rounded-2xl glass card-hover" style={{ borderColor:"var(--glass-border)" }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-deep">{resource.name}</h3>
          <div className="text-sm muted mt-1">{resource.location} • {resource.type}</div>
          <div className="text-xs muted mt-2">{resource.description}</div>
          <div className="text-xs muted mt-2">Capacity: {resource.capacity}</div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${resource.available?"bg-emerald-100 text-emerald-800":"bg-rose-100 text-rose-800"}`}>{resource.available?"Available":"Unavailable"}</div>
          <button disabled={!resource.available} onClick={()=>onBook?.(resource)} className={`px-4 py-2 rounded-md text-sm ${resource.available?"btn-cta":"bg-gray-100 text-gray-500 cursor-not-allowed"}`}>{resource.available?"Book":"Request"}</button>
        </div>
      </div>
    </div>
  );
}
