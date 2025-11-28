// src/components/gamification/ProfileXP.jsx
import React, { useEffect, useState } from "react";
import { xpService } from "../../services/xp.service";

export default function ProfileXP({ user }) {
  const username = typeof user === "string" ? user : user?.name ?? "Unknown";
  const [profile, setProfile] = useState(() => xpService.getProfile(username));

  useEffect(() => {
    const refresh = () => setProfile(xpService.getProfile(username));

    window.__campus_bus?.addEventListener?.("xp:updated", refresh);
    window.__campus_bus?.addEventListener?.("xp:badge", refresh);

    return () => {
      window.__campus_bus?.removeEventListener?.("xp:updated", refresh);
      window.__campus_bus?.removeEventListener?.("xp:badge", refresh);
    };
  }, [username]);

  const { xp = 0, level = 1, progress = 0, badges = [] } = profile || {};

  return (
    <div className="glass p-5 rounded-xl shadow border" style={{ borderColor: "var(--glass-border)" }}>
      <h2 className="text-xl font-bold mb-2">{username}</h2>
      <p className="text-sm text-slate-500 mb-3">Level {level} • {xp} XP</p>

      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden mb-4">
        <div
          className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>

      <h3 className="font-semibold text-sm mb-1">Badges</h3>
      <div className="flex flex-wrap gap-2">
        {badges.length === 0 ? (
          <span className="text-xs text-slate-500">No badges yet.</span>
        ) : (
          badges.map((b) => (
            <span key={b} className="px-2 py-1 rounded bg-white border shadow-sm text-xs">
              {xpService.BADGES[b]?.icon} {xpService.BADGES[b]?.title}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
