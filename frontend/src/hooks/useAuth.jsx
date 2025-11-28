// src/hooks/useAuth.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.currentUser());
  const [ready, setReady] = useState(true);

  useEffect(() => {
    setUser(authService.currentUser());
  }, []);

  const login = async (cred) => {
    const res = await authService.login(cred);
    setUser(res.user);
    return res.user;
  };

  const register = async (payload) => {
    const res = await authService.register(payload);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
