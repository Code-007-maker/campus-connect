import React from "react";

export default function ProjectCard({ project, onJoin }) {
  return (
    <div className="glass p-6 rounded-2xl shadow-xl transition-all transform hover:-translate-y-2 hover:scale-[1.01] hover:shadow-2xl border">
      <h3 className="text-xl font-extrabold text-deep">{project.title}</h3>
      <p className="text-sm mt-2 text-slate-600">{project.description}</p>

      <div className="flex flex-wrap gap-2 mt-4">
        {project.skills?.map((s) => (
          <span key={s}
            className="px-3 py-1 rounded-full text-xs text-white"
            style={{ background: "linear-gradient(90deg,var(--accent-start),var(--accent-mid))" }}>
            {s}
          </span>
        ))}
      </div>

      <button onClick={() => onJoin(project.id)}
        className="btn-cta w-full mt-5 py-2 rounded-xl">
        Join Team
      </button>
    </div>
  );
}
