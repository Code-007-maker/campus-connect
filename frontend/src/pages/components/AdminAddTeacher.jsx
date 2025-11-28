// src/pages/AdminAddTeacher.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/ui/Toast";
import api from "../lib/api";

export default function AdminAddTeacher() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({open:false,message:"",type:""});

  const submit = async (e) => {
    e?.preventDefault();
    if(!email) { setToast({open:true,message:"Email required",type:"error"}); return; }
    setLoading(true);
    try {
      const res = await api.post("/api/admin/add-teacher", { email, name });
      setToast({open:true,message:res.message || "Invite sent",type:"success"});
      setEmail(""); setName("");
    } catch (err) {
      const msg = err?.body?.message || err.message || "Failed to invite";
      setToast({open:true,message:msg,type:"error"});
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return <div className="p-6">Admin access required.</div>;
  }

  return (
    <div className="max-w-md p-6 bg-white rounded-2xl shadow">
      <h3 className="text-xl font-semibold mb-4">Invite Teacher</h3>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm muted">Teacher name (optional)</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-3 mt-2 border rounded-xl" />
        </div>
        <div>
          <label className="text-sm muted">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3 mt-2 border rounded-xl" />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn-cta py-2 px-4 rounded-xl">{loading ? "Sending..." : "Invite"}</button>
        </div>
      </form>

      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={()=>setToast({...toast,open:false})} />
    </div>
  );
}
