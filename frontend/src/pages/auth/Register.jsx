// src/pages/Auth/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.name || !form.email || !form.password) {
      setErr("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const res = await authService.register(form);
      // res: { user, token } maybe demo fallback
      localStorage.setItem("cc_user", JSON.stringify(res.user));
      localStorage.setItem("cc_token", res.token);
      nav("/");
    } catch (error) {
      console.error("Register failed", error);
      setErr(error?.message || "Network Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-extrabold mb-2 text-gray-900">Create account</h2>
          <p className="text-sm text-gray-600 mb-6">Register to join your campus network</p>

          {err && <div className="mb-4 text-sm text-rose-800 bg-rose-100 p-3 rounded">{err}</div>}

          <form onSubmit={submit} className="space-y-4">
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-200 bg-white/70 focus:ring-4 focus:ring-indigo-200"
              placeholder="Full name"
            />
            <input
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-200 bg-white/70 focus:ring-4 focus:ring-indigo-200"
              placeholder="you@college.edu"
            />
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-200 bg-white/70 focus:ring-4 focus:ring-indigo-200"
              placeholder="Strong password"
            />

            <div className="flex items-center justify-between">
              <Link to="/login" className="text-sm text-indigo-700 hover:underline">Already have an account?</Link>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow"
              >
                {loading ? "Creating..." : "Register"}
              </button>
            </div>
          </form>

          <div className="mt-4 text-xs text-gray-500">
            If backend is offline you will be registered into a demo account for presentation purposes.
          </div>
        </div>
      </div>
    </div>
  );
}
