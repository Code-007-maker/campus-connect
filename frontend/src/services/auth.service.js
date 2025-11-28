// src/services/auth.service.js
import api from "./api";

/*
  Behavior:
  - Try real backend endpoints (/auth/login, /auth/register, /auth/me).
  - If network call fails (no backend running), fallback to a demo/mock response so UI continues to work.
  - This makes the demo stable during hackathon even if backend is not ready.
*/

const DEMO_USER = {
  _id: "demo-user-1",
  name: "Demo Student",
  email: "demo@student.edu",
  role: "student",
};

const makeToken = () => "demo-token-" + Date.now();

export const authService = {
  login: async (creds) => {
    try {
      const res = await api.post("/auth/login", creds);
      // Expect backend: { user, token }
      return res;
    } catch (err) {
      // Network or server error -> fallback demo (but still log)
      console.warn("authService.login fallback to DEMO due to:", err);
      const demo = { user: { ...DEMO_USER, email: creds.email || DEMO_USER.email }, token: makeToken() };
      return demo;
    }
  },

  register: async (payload) => {
    try {
      const res = await api.post("/auth/register", payload);
      return res;
    } catch (err) {
      console.warn("authService.register fallback to DEMO due to:", err);
      // Return mock success and auto-login the demo user with given name/email
      const demo = { user: { ...DEMO_USER, name: payload.name || DEMO_USER.name, email: payload.email || DEMO_USER.email }, token: makeToken() };
      return demo;
    }
  },

  me: async () => {
    try {
      const res = await api.get("/auth/me");
      return res;
    } catch (err) {
      console.warn("authService.me fallback to DEMO due to:", err);
      return { user: DEMO_USER };
    }
  },
};
