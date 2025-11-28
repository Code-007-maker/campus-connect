// src/services/xp.service.js
// Gamification service (XP, levels, badges, leaderboard) using localStorage and event bus.
// Designed for demo / hackathon MVP.

const XP_KEY = "campus_xp_v1";
const PROFILE_KEY = "campus_profiles_v1"; // stores profile details like badges
const ACTIVITY_KEY = "campus_activity_v1"; // same key used by forum.service.js

// Level thresholds: cumulative XP required for each level.
// We provide a function levelForXp(xp) to compute level and progress.
const LEVEL_TABLE = [
  0,    // level 0
  50,   // level 1
  150,  // level 2
  300,  // level 3
  500,  // level 4
  800,  // level 5
  1200, // level 6
  1700, // level 7
  2300, // level 8
  3000, // level 9
  3800, // level 10
  4700, // level 11
  5700, // level 12
  6800, // level 13
  8000, // level 14
  9300, // level 15
  10700,// level 16
  12200,// level 17
  13800,// level 18
  15500,// level 19
  17300 // level 20 (legend)
];

// badges definitions
const BADGES = {
  nightout: { id: "nightout", title: "Night Owl", desc: "Logged in after midnight", icon: "🌙" },
  knowminer: { id: "knowminer", title: "Knowledge Miner", desc: "15 library days streak", icon: "📚" },
  helpguru: { id: "helpguru", title: "Help Guru", desc: "Most answers in a week", icon: "🧠" }
};

function readRaw(key, fallback = "{}") {
  try {
    return JSON.parse(localStorage.getItem(key) || fallback);
  } catch (e) {
    return JSON.parse(fallback);
  }
}

function writeRaw(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function ensure() {
  const xp = readRaw(XP_KEY, "{}");
  if (!xp || typeof xp !== "object") writeRaw(XP_KEY, {});
  const prof = readRaw(PROFILE_KEY, "{}");
  if (!prof || typeof prof !== "object") writeRaw(PROFILE_KEY, {});
}

// compute level & progress for a given xp
function levelForXp(xp) {
  let level = 0;
  for (let i = 1; i < LEVEL_TABLE.length; i++) {
    if (xp >= LEVEL_TABLE[i]) level = i;
    else break;
  }
  const currentReq = LEVEL_TABLE[level] ?? 0;
  const nextReq = LEVEL_TABLE[level + 1] ?? (LEVEL_TABLE[LEVEL_TABLE.length - 1] + 2000);
  const progress = Math.min(1, (xp - currentReq) / Math.max(1, (nextReq - currentReq)));
  return { level, progress, currentReq, nextReq };
}

// small helper to emit events via global bus
function emit(event, detail) {
  if (window.__campus_bus) {
    try {
      window.__campus_bus.dispatchEvent(new CustomEvent(event, { detail }));
    } catch (e) {
      // ignore
    }
  }
}

export const xpService = {
  BADGES,
  async init() {
    ensure();
    // optionally process activities to compute initial XP if XP store empty
    const xpMap = readRaw(XP_KEY, "{}");
    if (Object.keys(xpMap).length === 0) {
      // If there are activity logs, allocate baseline xp from them (demo-friendly)
      const rawActs = readRaw(ACTIVITY_KEY, "[]");
      const grouped = {};
      for (const a of rawActs) {
        grouped[a.user] = (grouped[a.user] || 0) + (a.type === "post_answer" ? 12 : a.type === "post_question" ? 8 : 3);
      }
      for (const u of Object.keys(grouped)) {
        xpMap[u] = (xpMap[u] || 0) + grouped[u];
      }
      writeRaw(XP_KEY, xpMap);
    }
    emit("xp:init", { ok: true });
  },

  // award XP directly for a user (type is optional, for analytics)
  award(user, type = "manual", amount = 10) {
    if (!user) return;
    ensure();
    const xpMap = readRaw(XP_KEY, "{}");
    xpMap[user] = (xpMap[user] || 0) + amount;
    writeRaw(XP_KEY, xpMap);

    // log as activity for cross-service processing
    const rawActs = readRaw(ACTIVITY_KEY, "[]");
    rawActs.unshift({ type: `xp_award:${type}`, user, ts: Date.now(), amount });
    writeRaw(ACTIVITY_KEY, rawActs);

    // dispatch event for UI
    emit("xp:updated", { user, amount, total: xpMap[user] });

    // level up badge check
    this._checkLevelBadges(user, xpMap[user]);

    return xpMap[user];
  },

  // get XP total
  getXp(user) {
    const xpMap = readRaw(XP_KEY, "{}");
    return xpMap[user] || 0;
  },

  // get profile (xp + computed level + badges)
  getProfile(user) {
    const xp = this.getXp(user);
    const profs = readRaw(PROFILE_KEY, "{}");
    const profile = profs[user] || { badges: [], displayName: user };
    const lvl = levelForXp(xp);
    return { user, xp, level: lvl.level, progress: lvl.progress, nextReq: lvl.nextReq, badges: profile.badges || [] };
  },

  // award badge (id like 'nightout'), return true if newly added
  awardBadge(user, badgeId) {
    if (!user || !BADGES[badgeId]) return false;
    ensure();
    const profs = readRaw(PROFILE_KEY, "{}");
    const profile = profs[user] || { badges: [] };
    if ((profile.badges || []).includes(badgeId)) return false;
    profile.badges = [...(profile.badges || []), badgeId];
    profs[user] = profile;
    writeRaw(PROFILE_KEY, profs);
    emit("xp:badge", { user, badgeId, badge: BADGES[badgeId] });
    return true;
  },

  // get leaderboard (top N)
  leaderboard(limit = 20) {
    const xpMap = readRaw(XP_KEY, "{}");
    const items = Object.keys(xpMap).map((u) => ({ user: u, xp: xpMap[u] }));
    items.sort((a, b) => b.xp - a.xp);
    return items.slice(0, limit).map((it, idx) => {
      const lvl = levelForXp(it.xp);
      return { rank: idx + 1, user: it.user, xp: it.xp, level: lvl.level, progress: lvl.progress };
    });
  },

  // process recent activities to award XP (can be run periodically)
  async processRecentActivities(sinceTs = 0) {
    ensure();
    const acts = readRaw(ACTIVITY_KEY, "[]").filter(a => !sinceTs || (a.ts >= sinceTs));
    // basic mapping of activity types -> xp
    const map = {
      post_question: 8,
      post_answer: 12,
      upvote_question: 2,
      upvote_answer: 3,
      accept_answer: 20,
      project_create: 25,
      project_join: 10,
      xp_award: 0 // already xp awards
    };
    const xpMap = readRaw(XP_KEY, "{}");
    for (const a of acts) {
      // try to normalize type base (if colon exists)
      const base = (a.type || "").split(":")[0];
      const amount = map[base] || 1;
      if (!a.user) continue;
      xpMap[a.user] = (xpMap[a.user] || 0) + amount;
    }
    writeRaw(XP_KEY, xpMap);
    emit("xp:processed", { count: acts.length });
    return xpMap;
  },

  // private: check level-based badges (for demo: Level 5 => "Campus Explorer", Level 10 => "Dept Pro", 20 => "Legend")
  _checkLevelBadges(user, xpTotal) {
    const lvl = levelForXp(xpTotal).level;
    if (lvl >= 20) this.awardBadge(user, "legend_of_campus"); // we define legend later (dynamic)
    if (lvl >= 10) this.awardBadge(user, "dept_pro");
    if (lvl >= 5) this.awardBadge(user, "campus_explorer");
  },

  // helper to create custom badges (demo)
  defineBadge(id, { title, desc, icon }) {
    BADGES[id] = { id, title, desc, icon };
  }
};

// define some level badges for display (demo)
xpService.defineBadge("campus_explorer", { title: "Campus Explorer", desc: "Reached level 5", icon: "🧭" });
xpService.defineBadge("dept_pro", { title: "Department Pro", desc: "Reached level 10", icon: "🏅" });
xpService.defineBadge("legend_of_campus", { title: "Legend of Campus", desc: "Reached level 20", icon: "🌟" });

// initialize at load
xpService.init().catch(()=>{});
