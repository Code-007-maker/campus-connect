// src/services/gamification.service.js
import { forumService } from "./forum.service.js";
import { xpService } from "./xp.service.js";

const KEY = "campus_badges_v2";
const LEADER_KEY = "campus_leaderboard_v1";

/*
Badge definitions:
- help_guru: most answers in a week (weekly)
- night_owl: login after midnight (use xp activity or login hook)
- knowledge_miner: 15-day library streak (external event required)
*/

const BADGES = {
  help_guru: { id: "help_guru", title: "Help Guru", desc: "Most answered questions this week" },
  night_owl: { id: "night_owl", title: "Night Owl", desc: "Logged in late-night study sessions" },
  knowledge_miner: { id: "knowledge_miner", title: "Knowledge Miner", desc: "15-day library streak" },
  welcome: { id: "welcome", title: "Welcome Badge", desc: "Registered on CampusConnect" }
};

function readAll(){ try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch(e){ return {}; } }
function writeAll(obj){ localStorage.setItem(KEY, JSON.stringify(obj)); }

export const gamificationService = {
  list(userId){
    const all = readAll();
    if(userId) return all[userId] || [];
    return all;
  },

  awardBadge(userId, badgeId){
    if(!userId) return;
    const all = readAll();
    if(!all[userId]) all[userId] = [];
    if(all[userId].find(b=>b.id===badgeId)) return; // already awarded
    const b = BADGES[badgeId] || { id: badgeId, title: badgeId };
    all[userId].push({ ...b, awardedAt: new Date().toISOString() });
    writeAll(all);
    // award some XP too (for example)
    xpService.award(userId, "badge_awarded", 20);
    return b;
  },

  getUserBadges(userId){
    const all = readAll();
    return all[userId] || [];
  },

  // weekly leaderboard: compute number of answers per user in the last 7 days
  async computeWeeklyLeaderboard(){
    const since = Date.now() - 7*24*3600*1000;
    const acts = await forumService.listActivities({ sinceTs: since });
    const counts = {};
    for(const a of acts){
      if(a.type === "post_answer"){
        const u = a.user || "anonymous";
        counts[u] = (counts[u] || 0) + 1;
      }
    }
    // build sorted list
    const arr = Object.keys(counts).map(u => ({ user: u, answers: counts[u] })).sort((a,b)=>b.answers - a.answers);
    localStorage.setItem(LEADER_KEY, JSON.stringify({ ts: Date.now(), data: arr }));
    // award help_guru to top 1 (if present)
    if(arr.length > 0){
      const top = arr[0];
      gamificationService.awardBadge(top.user, "help_guru");
    }
    return arr;
  },

  // read cached leaderboard
  readCachedLeaderboard(){
    try { return JSON.parse(localStorage.getItem(LEADER_KEY) || "{}"); } catch(e){ return {}; }
  }
};
