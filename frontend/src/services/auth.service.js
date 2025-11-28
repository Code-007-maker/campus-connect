// src/services/auth.service.js
// Simple demo auth service storing users & session in localStorage.
// NOT production - replace backend calls in production.

const USERS_KEY = "campus_users_v1";
const SESSION_KEY = "campus_session_v1";

function seed() {
  if (localStorage.getItem(USERS_KEY)) return;
  const demo = [
    { id: "s_demo", name: "Demo Student", email: "student@demo.edu", role: "student", password: "student123" },
    { id: "f_demo", name: "Demo Faculty", email: "faculty@demo.edu", role: "faculty", password: "faculty123" },
    { id: "a_demo", name: "Demo Admin", email: "admin@demo.edu", role: "admin", password: "admin123" }
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(demo));
}

function loadUsers() {
  seed();
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}
function saveUsers(list) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

export const authService = {
  async register({ name, email, password, role = "student" }) {
    const users = loadUsers();
    if (users.find(u => u.email === email)) throw new Error("Email already used");
    const u = { id: (role[0] + Date.now()), name, email, password, role };
    users.unshift(u);
    saveUsers(users);
    // auto-login
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token: "demo-token-" + Date.now(), user: { id: u.id, name: u.name, email: u.email, role: u.role } }));
    return { user: { id: u.id, name: u.name, email: u.email, role: u.role } };
  },

  async login({ email, password }) {
    const users = loadUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid credentials");
    const token = "demo-token-" + Date.now();
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token, user: { id: found.id, name: found.name, email: found.email, role: found.role } }));
    return { user: { id: found.id, name: found.name, email: found.email, role: found.role } };
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  getSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  currentUser() {
    const s = authService.getSession();
    return s?.user || null;
  }
};
