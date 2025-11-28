// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await register(form);
      nav("/", { replace: true });
    } catch (e) {
      setErr(e.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-extrabold text-slate-900">Create account</h2>
        <p className="text-sm text-slate-500">Register as Student, Faculty or Admin (demo)</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Full name</label>
          <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
            className="mt-1 block w-full px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-emerald-400 transition" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
            className="mt-1 block w-full px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-emerald-400 transition" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input required type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
            className="mt-1 block w-full px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-emerald-400 transition" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Role</label>
          <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}
            className="mt-1 block w-full px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-emerald-400 transition">
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {err && <div className="text-sm text-rose-600">{err}</div>}

        <button type="submit" disabled={loading}
          className="w-full mt-2 px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-indigo-600 text-white font-semibold shadow hover:scale-[1.01] transition">
          {loading ? "Creating..." : "Create account"}
        </button>

        <div className="text-sm text-center text-slate-500 mt-3">
          Already registered? <a href="/login" className="text-indigo-600 underline">Sign in</a>
        </div>
      </form>
    </div>
  );
}
