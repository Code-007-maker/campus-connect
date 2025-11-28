// simple mock service using localStorage
const KEY = "campus_announcements_v1";
export const announcementService = {
  async list(){
    try {
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      // simulate latency
      await new Promise(r=>setTimeout(r, 250));
      return arr;
    } catch(e){ return []; }
  },
  async create(payload){
    const raw = localStorage.getItem(KEY) || "[]";
    const arr = JSON.parse(raw);
    const item = { ...payload, _id: "a-"+Date.now(), createdAt: new Date().toISOString() };
    arr.unshift(item);
    localStorage.setItem(KEY, JSON.stringify(arr));
    // emit socket event
    if(window.__campus_bus) window.__campus_bus.dispatchEvent(new CustomEvent("announcement:created", { detail: item }));
    return item;
  }
};
