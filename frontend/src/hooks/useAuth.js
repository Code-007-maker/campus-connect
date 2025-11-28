import { useState, useEffect } from "react";

const STORAGE_KEY = "campus_user";

export function useAuthProvider(){
  const [user, setUser] = useState(null);
  useEffect(()=> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw) setUser(JSON.parse(raw));
    } catch {}
  },[]);

  const login = (payload) => {
    const u = { id: Date.now(), name: payload.name || "Demo User", role: payload.role || "student", email: payload.email || "demo@campus" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
    return u;
  };

  const register = (payload) => login(payload);

  const logout = () => { localStorage.removeItem(STORAGE_KEY); setUser(null); };

  return { user, login, register, logout };
}

// Hook wrapper
export function useAuth(){
  // simple global-ish: instantiate provider once per module (not ideal in prod)
  // In this MVP we'll use a singleton provider stored on window
  if(!window.__campus_auth){
    window.__campus_auth = { ...useAuthProvider() };
  }
  // but React hooks can't be conditionally created - instead export small helper that uses localStorage directly
  const [user, setUser] = useState(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"));
  useEffect(()=> {
    const onStorage = () => setUser(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"));
    window.addEventListener("storage", onStorage);
    return ()=> window.removeEventListener("storage", onStorage);
  },[]);
  const login = (payload) => { const u = { id: Date.now(), name: payload.name || "Demo User", role: payload.role || "student", email: payload.email || "demo@campus" }; localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); setUser(u); return u; };
  const register = (payload) => login(payload);
  const logout = () => { localStorage.removeItem(STORAGE_KEY); setUser(null); };

  return { user, login, register, logout };
}
