// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/ui/Toast";

export default function Login() {
  const nav = useNavigate();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open:false, message:"", type:"" });

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ open:true, message:"Please fill all fields", type:"error" });
      return;
    }

    setLoading(true);
    try {
      // Demo fallback if backend is offline
      await new Promise(r => setTimeout(r, 900));

      setToast({ open:true, message:`Logged in as ${role}`, type:"success" });

      // Redirect based on role
      nav("/");
    } catch (err) {
      setToast({ open:true, message:"Login failed", type:"error" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6  bg-gradient-to-br from-[#eef6ff] to-[#f4f8ff] relative">

      {/* BG floating shapes */}
      <div className="absolute top-2 left-10 w-[260px] h-[260px] rounded-full bg-[var(--accent-start)] opacity-10 blur-[90px] float-slow"></div>
      <div className="absolute bottom-20 right-20 w-[260px] h-[260px] rounded-full bg-[var(--accent-mid)] opacity-10 blur-[100px] float-slow"></div>

      <div className="glass p-10 rounded-3xl shadow-2xl max-w-md w-full relative animate-fade-up"
        style={{ backdropFilter:"blur(14px)", borderColor:"rgba(14,165,255,0.1)" }}>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-deep mb-2">Login</h1>
        <p className="text-[var(--muted)] mb-8">Access your CampusConnect dashboard</p>

        {/* Role Selector */}
        <div className="grid grid-cols-3 p-1 rounded-xl bg-slate-100 mb-6">
          {["student","faculty","admin"].map((r) => (
            <button
              key={r}
              className={`py-2 rounded-lg text-sm font-medium transition-all
                ${role === r
                  ? "text-white accent-gradient"
                  : "text-slate-600 hover:bg-slate-200"}`}
              onClick={() => setRole(r)}
            >
              {r.charAt(0).toUpperCase()+r.slice(1)}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-sm text-slate-600">Email Address</label>
            <input
              type="email"
              className="w-full p-3 mt-2 border rounded-xl focus:ring-4 ring-[var(--accent-mid)]/20 transition"
              placeholder="you@college.edu"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Password</label>
            <input
              type="password"
              className="w-full p-3 mt-2 border rounded-xl focus:ring-4 ring-[var(--accent-mid)]/20 transition"
              placeholder="Enter strong password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          <button className="btn-cta w-full py-3 mt-2 rounded-xl text-lg">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-sm mt-6 text-slate-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[var(--accent-mid)] font-medium">Register</Link>
        </p>
      </div>

      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({open:false})} />
    </div>
  );
}
