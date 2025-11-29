// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await login(form);
      nav("/", { replace: true });
    } catch (e) {
      setErr(e.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome back</h2>
        <p className="text-sm text-slate-500 dark:text-white">Sign in to access CampusConnect</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-white">Email</label>
          <input required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
            className="mt-1 block w-full px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-indigo-400 transition" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-white">Password</label>
          <input required type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
            className="mt-1 block w-full px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-indigo-400 transition" />
        </div>

        {err && <div className="text-sm text-rose-600">{err}</div>}

        <button type="submit" disabled={loading}
          className="w-full mt-2 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow hover:scale-[1.01] transition">
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="text-sm text-center text-slate-500 mt-3">
          No account? <a href="/register" className="text-indigo-600 underline">Register</a>
        </div>
      </form>
    </div>
  );
}
