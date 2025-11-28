// src/components/gamification/ProfileXP.jsx
import React, { useEffect, useState } from "react";
import { xpService } from "../../services/xp.service";

export default function ProfileXP({ user }) {
  const userKey = typeof user === "string" ? user : user?.name ?? "Unknown";
  const [profile, setProfile] = useState(() => xpService.getProfile(userKey));

  useEffect(() => {
    function refresh() {
      setProfile(xpService.getProfile(userKey));
    }

    window.__campus_bus?.addEventListener?.("xp:updated", refresh);
    window.__campus_bus?.addEventListener?.("xp:badge", refresh);

    return () => {
      window.__campus_bus?.removeEventListener?.("xp:updated", refresh);
      window.__campus_bus?.removeEventListener?.("xp:badge", refresh);
    };
  }, [userKey]);

  const { xp = 0, level = 1, progress = 0, badges = [] } = profile || {};

  return (
    <div className="glass p-5 rounded-2xl shadow-lg border" style={{ borderColor: "var(--glass-border)" }}>
      <h2 className="text-xl font-bold text-deep mb-2">{userKey}</h2>

      <div className="mb-2 text-sm muted">Level {level} • {xp} XP</div>

      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.round(progress * 100)}%`,
            background: "linear-gradient(90deg,var(--accent-start),var(--accent-mid))"
          }}
        />
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-deep mb-2 text-sm">Badges</h3>
        <div className="flex flex-wrap gap-2">
          {(badges || []).length === 0 ? (
            <div className="text-xs muted">No badges yet.</div>
          ) : (
            badges.map((b) => (
              <span key={b} className="px-2 py-1 text-xs rounded bg-white/70 border shadow-sm">
                {xpService.BADGES[b]?.icon || "🏅"} {xpService.BADGES[b]?.title}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
