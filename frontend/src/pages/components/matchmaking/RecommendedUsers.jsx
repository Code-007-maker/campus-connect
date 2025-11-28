// src/pages/components/matchmaking/RecommendedUsers.jsx
import React, { useEffect, useState } from "react";
import { projectService } from "../../../services/project.service";

export default function RecommendedUsers({ skills = [] }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const recommended = await projectService.recommendUsers(skills);
        if (mounted) setUsers(recommended);
      } catch (e) {
        console.error("Failed to load recommended users:", e);
        if (mounted) setUsers([]);
      }
    })();
    return () => (mounted = false);
  }, [skills]);

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold text-deep mb-3">Recommended Teammates</h2>

      <div className="grid md:grid-cols-4 gap-6">
        {users.length === 0 ? (
          <div className="text-sm muted">No recommendations right now.</div>
        ) : (
          users.map((u) => (
            <div
              key={u.name}
              className="glass p-6 rounded-2xl shadow transition hover:scale-[1.02] hover:shadow-xl border"
              style={{ borderColor: "var(--glass-border)" }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-semibold shadow-md mx-auto"
                style={{
                  background:
                    "linear-gradient(90deg,var(--accent-start),var(--accent-mid))",
                }}
              >
                {u.name[0]}
              </div>

              <div className="text-center mt-3">
                <div className="font-semibold text-deep">{u.name}</div>
                <div className="text-xs muted">XP: {u.xp}</div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {u.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-1 rounded-full text-xs bg-slate-100 border"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <button className="btn-cta w-full mt-4 py-2 rounded-xl">
                Invite to Team
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
