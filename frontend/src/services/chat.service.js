// src/services/chat.service.js
// Demo chat service using localStorage and window.__campus_bus for realtime events

const KEY = "campus_chat_v1";
const PRESENCE_KEY = "campus_presence_v1";

function ensure() {
  if (!localStorage.getItem(KEY)) {
    const seed = {
      channels: [
        { id: "general", name: "general", title: "General (Campus)", createdAt: new Date().toISOString(), createdBy: "System" },
        { id: "projects", name: "projects", title: "Project Matchmaking", createdAt: new Date().toISOString(), createdBy: "System" },
        { id: "random", name: "random", title: "Random & Social", createdAt: new Date().toISOString(), createdBy: "System" }
      ],
      messages: {
        general: [
          { id: "m1", author: "ProfA", text: "Welcome to CampusConnect chat!", ts: Date.now() - 1000*60*60, meta: {} }
        ],
        projects: [],
        random: []
      }
    };
    localStorage.setItem(KEY, JSON.stringify(seed));
  }
}
function read() { ensure(); return JSON.parse(localStorage.getItem(KEY)); }
function write(obj){ localStorage.setItem(KEY, JSON.stringify(obj)); }

function emit(event, payload){
  if(window.__campus_bus) window.__campus_bus.dispatchEvent(new CustomEvent(event, { detail: payload }));
}

export const chatService = {
  async listChannels(){
    const d = read();
    // simulate latency
    await new Promise(r=>setTimeout(r,120));
    return d.channels;
  },

  async createChannel({ name, title, createdBy }){
    const d = read();
    const ch = { id: name, name, title: title || name, createdAt: new Date().toISOString(), createdBy };
    d.channels.unshift(ch);
    d.messages[ch.id] = [];
    write(d);
    emit("chat:channel:created", ch);
    return ch;
  },

  async listMessages(channelId, { limit = 200 } = {}){
    const d = read();
    await new Promise(r=>setTimeout(r, 80));
    const arr = d.messages[channelId] || [];
    return arr.slice(-limit);
  },

  async sendMessage(channelId, { author, text, attachments }){
    const d = read();
    if(!d.messages[channelId]) d.messages[channelId] = [];
    const msg = { id: "m"+Date.now(), author, text, ts: Date.now(), attachments: attachments||[], meta: { reactions: {} } };
    d.messages[channelId].push(msg);
    write(d);
    emit("chat:message:created", { channelId, message: msg });
    return msg;
  },

  async deleteMessage(channelId, messageId){
    const d = read();
    if(!d.messages[channelId]) return;
    d.messages[channelId] = d.messages[channelId].filter(m => m.id !== messageId);
    write(d);
    emit("chat:message:deleted", { channelId, messageId });
  },

  async reactMessage(channelId, messageId, user, reaction="👍"){
    const d = read();
    const msg = (d.messages[channelId]||[]).find(m => m.id === messageId);
    if(!msg) return;
    msg.meta.reactions[reaction] = msg.meta.reactions[reaction]||[];
    if(!msg.meta.reactions[reaction].includes(user)) msg.meta.reactions[reaction].push(user);
    write(d);
    emit("chat:message:reacted", { channelId, messageId, reaction, user });
    return msg;
  },

  // presence (store lastActive timestamp per username)
  setPresence(user){
    if(!user) return;
    const p = JSON.parse(localStorage.getItem(PRESENCE_KEY) || "{}");
    p[user] = Date.now();
    localStorage.setItem(PRESENCE_KEY, JSON.stringify(p));
    emit("chat:user:presence", { user, ts: p[user] });
  },

  getPresence(){
    return JSON.parse(localStorage.getItem(PRESENCE_KEY) || "{}");
  }
};
