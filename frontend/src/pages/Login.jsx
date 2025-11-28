import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Toast from "../components/ui/Toast";

export default function Login(){
  const { login } = useAuth();
  const nav = useNavigate();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({open:false,message:"",type:""});
  const [loading,setLoading]=useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    if(!email || !password){ setToast({open:true,message:"Please fill in",type:"error"}); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,700));
    login({ name: email.split("@")[0], email, role });
    setToast({open:true,message:`Logged in as ${role}`,type:"success"});
    setLoading(false);
    nav("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass p-10 rounded-3xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-extrabold mb-1">Welcome back</h2>
        <p className="muted mb-6">Sign in to CampusConnect</p>

        <div className="grid grid-cols-3 p-1 rounded-xl bg-slate-100 mb-6">
          {["student","faculty","admin"].map(r=>(
            <button key={r} onClick={()=>setRole(r)} className={`py-2 rounded-lg ${role===r ? "text-white accent-gradient" : "text-slate-600 hover:bg-slate-200"}`}>{r.charAt(0).toUpperCase()+r.slice(1)}</button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm muted">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3 mt-2 border rounded-xl" />
          </div>
          <div>
            <label className="text-sm muted">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3 mt-2 border rounded-xl" />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm muted">Demo mode</div>
            <button className="btn-cta py-3 px-6 rounded-xl text-lg">{loading ? "Signing..." : "Login"}</button>
          </div>
        </form>

        <p className="mt-6 text-sm">Don't have an account? <Link to="/register" className="text-[var(--accent-mid)] font-medium">Register</Link></p>
      </div>

      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={()=>setToast({...toast,open:false})} />
    </div>
  );
}
