import React from "react";
import { gamificationService } from "../../services/gamification.service";

export default function BadgeList(){
  const badges = gamificationService.list();
  return (
    <div className="p-4 glass rounded-2xl">
      <h4 className="font-semibold mb-3">Badges</h4>
      {badges.length===0 ? <div className="muted text-sm">No badges yet. Participate to earn!</div> : (
        <div className="flex gap-3 flex-wrap">
          {badges.map(b=>(
            <div key={b.id} className="p-2 rounded-lg bg-white/80 border">{b.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
