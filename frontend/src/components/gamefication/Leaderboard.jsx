// src/components/gamification/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import { gamificationService } from "../../services/gamification.service";


export default function Leaderboard(){
  const [leaders, setLeaders] = useState([]);

  useEffect(()=>{
    (async ()=>{
      const res = await gamificationService.computeWeeklyLeaderboard();
      setLeaders(res.slice(0,10));
    })();
  },[]);

  return (
    <div className="glass p-4 rounded-2xl border">
      <h4 className="font-semibold mb-3">Weekly Leaderboard</h4>
      {leaders.length === 0 ? <div className="muted text-sm">No activity this week.</div> : (
        <ol className="space-y-2">
          {leaders.map((l, idx) => (
            <li key={l.user} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[linear-gradient(90deg,var(--accent-start),var(--accent-mid))] text-white flex items-center justify-center font-semibold">{idx+1}</div>
                <div>
                  <div className="font-medium text-deep">{l.user}</div>
                  <div className="text-xs muted">{l.answers} answers</div>
                </div>
              </div>

              <div className="text-sm muted">Rank #{idx+1}</div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
