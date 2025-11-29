import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cc_user")); }
    catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("cc_token"));
  const [loading, setLoading] = useState(false);

  // Save to localStorage
  useEffect(() => {
    if (token) localStorage.setItem("cc_token", token);
    else localStorage.removeItem("cc_token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("cc_user", JSON.stringify(user));
    else localStorage.removeItem("cc_user");
  }, [user]);

  // --- API base ---
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // --- LOGIN ---
  const login = async ({ email, password }) => {
    setLoading(true);
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) throw new Error(data.message || "Login failed");

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  // --- REGISTER ---
  const register = async ({ name, email, password, role }) => {
    setLoading(true);
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) throw new Error(data.message || "Registration failed");

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
