// src/services/forum.service.js
// Forum mock service using localStorage and emitting events on window.__campus_bus

const KEY = "campus_forum_v1";
const ACTIVITY_KEY = "campus_activity_v1";

function ensureData() {
  if (!localStorage.getItem(KEY)) {
    const seed = [
      {
        _id: "q1",
        title: "How to access GPU cluster for projects?",
        body: "Is there a permission form? Any quota rules?",
        tags: ["gpu", "lab", "projects"],
        author: "ProfA",
        createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
        answers: [
          {
            _id: "a1",
            body: "Fill request form on portal and contact sysadmin.",
            author: "TA_Raj",
            createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
            votes: 3,
            accepted: true
          }
        ],
        votes: 5
      },
      {
        _id: "q2",
        title: "Best libraries for orbital mechanics?",
        body: "Looking for Python/C++ libraries to simulate orbits.",
        tags: ["astrophysics", "python"],
        author: "student123",
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        answers: [],
        votes: 2
      }
    ];
    localStorage.setItem(KEY, JSON.stringify(seed));
  }
}

function all() {
  ensureData();
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export const forumService = {
  async list() {
    ensureData();
    await new Promise(r => setTimeout(r, 150));
    return all();
  },

  async get(id) {
    await new Promise(r => setTimeout(r, 120));
    return all().find(q => q._id === id);
  },

  async createQuestion(payload) {
    const q = {
      _id: "q" + Date.now(),
      title: payload.title,
      body: payload.body,
      tags: payload.tags || [],
      author: payload.author || "Anonymous",
      createdAt: new Date().toISOString(),
      answers: [],
      votes: 0
    };
    const arr = all();
    arr.unshift(q);
    localStorage.setItem(KEY, JSON.stringify(arr));

    this._logActivity({ type: "post_question", user: q.author, id: q._id, ts: Date.now() });

    if (window.__campus_bus)
      window.__campus_bus.dispatchEvent(new CustomEvent("forum:question:created", { detail: q }));

    return q;
  },

  async createAnswer(questionId, payload) {
    const arr = all();
    const qIndex = arr.findIndex(q => q._id === questionId);
    if (qIndex === -1) throw new Error("Question not found");

    const ans = {
      _id: "a" + Date.now(),
      body: payload.body,
      author: payload.author || "Anonymous",
      createdAt: new Date().toISOString(),
      votes: 0,
      accepted: false
    };

    arr[qIndex].answers.unshift(ans);
    localStorage.setItem(KEY, JSON.stringify(arr));

    this._logActivity({
      type: "post_answer",
      user: ans.author,
      id: ans._id,
      ref: questionId,
      ts: Date.now()
    });

    if (window.__campus_bus)
      window.__campus_bus.dispatchEvent(
        new CustomEvent("forum:answer:created", { detail: { questionId, answer: ans } })
      );

    return ans;
  },

  async upvoteQuestion(id, byUser) {
    const arr = all();
    const i = arr.findIndex(q => q._id === id);
    if (i === -1) throw new Error("not found");

    arr[i].votes++;
    localStorage.setItem(KEY, JSON.stringify(arr));

    this._logActivity({ type: "upvote_question", user: byUser, id, ts: Date.now() });

    if (window.__campus_bus)
      window.__campus_bus.dispatchEvent(
        new CustomEvent("forum:question:upvoted", { detail: { id, byUser } })
      );

    return arr[i];
  },

  async upvoteAnswer(questionId, answerId, byUser) {
    const arr = all();
    const q = arr.find(q => q._id === questionId);
    if (!q) throw new Error("q not found");

    const a = q.answers.find(a => a._id === answerId);
    if (!a) throw new Error("a not found");

    a.votes++;
    localStorage.setItem(KEY, JSON.stringify(arr));

    this._logActivity({
      type: "upvote_answer",
      user: byUser,
      id: answerId,
      ref: questionId,
      ts: Date.now()
    });

    if (window.__campus_bus)
      window.__campus_bus.dispatchEvent(
        new CustomEvent("forum:answer:upvoted", { detail: { questionId, answerId, byUser } })
      );

    return a;
  },

  async acceptAnswer(questionId, answerId, byUser) {
    const arr = all();
    const q = arr.find(q => q._id === questionId);
    if (!q) throw new Error("q not found");

    q.answers.forEach(a => (a.accepted = a._id === answerId));
    localStorage.setItem(KEY, JSON.stringify(arr));

    this._logActivity({
      type: "accept_answer",
      user: byUser,
      id: answerId,
      ref: questionId,
      ts: Date.now()
    });

    if (window.__campus_bus)
      window.__campus_bus.dispatchEvent(
        new CustomEvent("forum:answer:accepted", { detail: { questionId, answerId, byUser } })
      );

    return q;
  },

  _logActivity(entry) {
    const raw = localStorage.getItem(ACTIVITY_KEY) || "[]";
    const arr = JSON.parse(raw);
    arr.unshift(entry);

    const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 35;
    const filtered = arr.filter(a => (a.ts || 0) > cutoff);

    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(filtered));
  },

  async listActivities({ sinceTs }) {
    const raw = localStorage.getItem(ACTIVITY_KEY) || "[]";
    const arr = JSON.parse(raw);
    if (sinceTs) return arr.filter(a => a.ts >= sinceTs);
    return arr;
  }
};
