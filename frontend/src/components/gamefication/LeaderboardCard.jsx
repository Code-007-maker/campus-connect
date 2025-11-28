// src/components/gamification/LeaderboardCard.jsx
import React from "react";

/**
 * Robust LeaderboardCard: supports either
 *  - <LeaderboardCard item={it} />
 *  - <LeaderboardCard user={userObj} rank={n} />
 */
export default function LeaderboardCard(props) {
  const { item, user: userProp, rank: rankProp } = props;

  let user = null;
  let rank = rankProp ?? (item && (item.rank || item.position)) ?? null;
  let xp = 0;
  let level = item?.level ?? 0;
  let role = "";

  if (item) {
    if (typeof item.user === "string") {
      user = { name: item.user };
      xp = item.xp ?? 0;
    } else if (typeof item.user === "object" && item.user !== null) {
      user = item.user;
      xp = item.xp ?? item.user.xp ?? 0;
      role = item.user.role ?? "";
    } else {
      user = { name: item.user?.name ?? item.user ?? "Unknown" };
      xp = item.xp ?? 0;
      role = item.role ?? "";
    }
    level = item.level ?? level;
  } else if (userProp) {
    user = userProp;
    xp = userProp.xp ?? xp;
    role = userProp.role ?? "";
  } else {
    user = { name: "Unknown" };
  }

  const displayName = user?.name ?? String(user);
  const displayXp = xp ?? 0;

  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank ?? "—"}`;

  return (
    <div
      className="glass p-4 rounded-xl shadow-sm flex items-center justify-between hover:scale-[1.01] hover:shadow-lg transition border"
      style={{ borderColor: "var(--glass-border)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
          style={{
            background: "linear-gradient(90deg,var(--accent-start),var(--accent-mid))",
          }}
        >
          {String(displayName)[0]?.toUpperCase() ?? "U"}
        </div>

        <div>
          <div className="font-semibold text-deep">{displayName}</div>
          {role ? <div className="text-xs text-slate-500">{role}</div> : null}
        </div>
      </div>

      <div className="text-right">
        <div className="font-bold text-indigo-600">{displayXp} XP</div>
        <div className="text-xs text-slate-500">{medal}</div>
      </div>
    </div>
  );
}
