import React, { useEffect } from "react";
export default function Toast({ open, message, type="success", onClose, timeout=3000 }){
  useEffect(()=> { if(!open) return; const t = setTimeout(()=>onClose?.(), timeout); return ()=>clearTimeout(t); }, [open, timeout, onClose]);
  if(!open) return null;
  const bg = type==="success" ? "bg-[var(--accent-mid)]" : "bg-rose-600";
  return (
    <div className="fixed z-50 right-6 bottom-6">
      <div className={`${bg} text-white px-4 py-3 rounded-lg shadow-xl fade-up`} role="status">
        <div className="flex items-center gap-3">
          <div className="font-medium">{message}</div>
          <button onClick={onClose} className="text-white/90 hover:text-white ml-2">✕</button>
        </div>
      </div>
    </div>
  );
}
