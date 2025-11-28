// src/components/matchmaking/Filters.jsx
import React, { useState } from "react";

const SKILLS = ["AI","ML","Python","WebGL","React","Tailwind","NodeJS","Astrophysics","C++","Design"];

export default function Filters({ onChange }) {
  const [selected, setSelected] = useState([]);

  const toggle = (s) => {
    const upd = selected.includes(s)
      ? selected.filter(x => x !== s)
      : [...selected, s];

    setSelected(upd);
    onChange(upd);
  };

  return (
    <div className="glass p-4 rounded-2xl border" style={{ borderColor: "var(--glass-border)" }}>
      <h3 className="font-semibold text-deep">Filter by Required Skills</h3>

      <div className="flex flex-wrap gap-2 mt-3">
        {SKILLS.map((s) => (
          <button
            key={s}
            onClick={() => toggle(s)}
            className={`px-3 py-1 rounded-full text-xs border transition ${
              selected.includes(s)
                ? "text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
            style={
              selected.includes(s)
                ? { background: "linear-gradient(90deg,var(--accent-start),var(--accent-mid))" }
                : {}
            }
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
