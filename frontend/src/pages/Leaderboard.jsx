// src/pages/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import { xpService } from "../services/xp.service";
import ProfileXP from "../components/gamification/ProfileXP.jsx";


import Badges from "../components/gamification/Badges";
import LeaderboardCard from "../components/gamification/LeaderboardCard";
import { useAuth } from "../hooks/useAuth";

export default function Leaderboard() {
  const { user } = useAuth() || { user: "Demo Student" };
  const [list, setList] = useState([]);
  const [profile, setProfile] = useState(xpService.getProfile(user));

  useEffect(() => {
    setList(xpService.leaderboard(20));
    setProfile(xpService.getProfile(user));

    function onUpdate() {
      setList(xpService.leaderboard(20));
      setProfile(xpService.getProfile(user));
    }

    window.__campus_bus?.addEventListener?.("xp:updated", onUpdate);
    window.__campus_bus?.addEventListener?.("xp:processed", onUpdate);
    window.__campus_bus?.addEventListener?.("xp:badge", onUpdate);

    return () => {
      window.__campus_bus?.removeEventListener?.("xp:updated", onUpdate);
      window.__campus_bus?.removeEventListener?.("xp:processed", onUpdate);
      window.__campus_bus?.removeEventListener?.("xp:badge", onUpdate);
    };
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-extrabold text-deep mb-4">Leaderboard</h1>
          <p className="muted mb-6">See top contributors on campus — earn XP by posting, answering, joining projects and more.</p>

          <div className="space-y-4">
            {list.map((it) => (
              <LeaderboardCard key={it.user} item={it} />
            ))}
          </div>
        </div>

        <aside>
          <ProfileXP user={user} />
          <div className="mt-6">
            <Badges userProfile={profile} />
          </div>
        </aside>
      </div>
    </div>
  );
}
