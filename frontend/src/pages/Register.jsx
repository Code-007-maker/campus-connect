// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/ui/Toast";

export default function Register() {
  const nav = useNavigate();

  const [role, setRole] = useState("student");
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [toast,setToast] = useState({open:false,message:"",type:""});

  const submit = async (e)=>{
    e.preventDefault();
    if(!name || !email || !password){
      setToast({open:true,message:"All fields required",type:"error"});
      return;
    }

    setLoading(true);
    try {
      await new Promise(r=>setTimeout(r,900));

      setToast({open:true,message:`Registered as ${role}`,type:"success"});
      nav("/login");
    } catch(err){
      setToast({open:true,message:"Registration failed",type:"error"});
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-[#eef6ff] to-[#f4f8ff] relative">

      {/* Floating BG visuals */}
      <div className="absolute top-20 left-20 w-[300px] h-[300px] rounded-full bg-[var(--accent-mid)] opacity-10 blur-[110px] float-slow"></div>
      <div className="absolute bottom-20 right-14 w-[260px] h-[260px] rounded-full bg-[var(--accent-start)] opacity-10 blur-[100px] float-slow"></div>

      <div className="glass p-10 rounded-3xl shadow-2xl max-w-md w-full relative animate-fade-up">

        <h1 className="text-3xl font-extrabold text-deep mb-2">Create Account</h1>
        <p className="text-[var(--muted)] mb-8">Join the unified campus platform</p>

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

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-sm text-slate-600">Full Name</label>
            <input
              className="w-full p-3 mt-2 border rounded-xl focus:ring-4 ring-[var(--accent-mid)]/20 transition"
              placeholder="Your full name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input
              className="w-full p-3 mt-2 border rounded-xl focus:ring-4 ring-[var(--accent-mid)]/20 transition"
              placeholder="email@college.edu"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Password</label>
            <input
              type="password"
              className="w-full p-3 mt-2 border rounded-xl focus:ring-4 ring-[var(--accent-mid)]/20 transition"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          <button className="btn-cta w-full py-3 rounded-xl text-lg">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm mt-6 text-slate-600">
          Already registered?{" "}
          <Link to="/login" className="text-[var(--accent-mid)] font-medium">Login</Link>
        </p>
      </div>

      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={()=>setToast({open:false})} />
    </div>
  );
}
