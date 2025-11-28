// src/components/gamification/Badges.jsx
import React from "react";
import { xpService } from "../../services/xp.service";

/**
 * Badges accepts either:
 *  - badges: array of badge ids
 *  - userProfile: object returned by xpService.getProfile(user) (contains badges array)
 *
 * This component is defensive and will display available badges from either prop.
 */
export default function Badges({ badges = [], userProfile = null }) {
  const list = (badges && badges.length) ? badges : (userProfile?.badges || []);

  if (!list || list.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-white/60 border" style={{ borderColor: "var(--glass-border)" }}>
        <div className="text-sm text-slate-600">No badges earned yet. Participate to unlock badges and climb the leaderboard!</div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-white/60 border" style={{ borderColor: "var(--glass-border)" }}>
      <h3 className="text-lg font-semibold text-deep mb-3">Badges</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {list.map((id) => {
          const b = xpService.BADGES[id] || { title: id, desc: "", icon: "🏅" };
          return (
            <div key={id} className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm border" style={{ borderColor: "var(--glass-border)" }}>
              <div className="w-12 h-12 rounded-md flex items-center justify-center text-2xl" style={{ background: "linear-gradient(90deg,var(--accent-start),var(--accent-mid))", color: "white" }}>
                {b.icon}
              </div>
              <div>
                <div className="font-medium text-deep">{b.title}</div>
                <div className="text-xs muted">{b.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
