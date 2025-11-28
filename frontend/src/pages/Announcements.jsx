import React, { useEffect, useState } from "react";
import AnnouncementCard from "../components/announcements/AnnouncementCard";
import AnnouncementForm from "../components/announcements/AnnouncementForm";
import { announcementService } from "../services/announcement.service";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";

export default function Announcements(){
  const [anns, setAnns] = useState([]);
  const { user } = useAuth();

  useEffect(()=>{ let mounted=true; (async ()=>{ try{ const res=await announcementService.list(); if(!mounted) return; setAnns(res.length?res:[]); }catch(e){ if(!mounted) return; setAnns([]); } })(); return ()=> mounted=false; },[]);

  useSocket("announcement:created", payload => setAnns(p=>[payload,...p]));

  const handleCreate = (data) => {
    // create already persisted via service; but we already create in AnnouncementForm
    setAnns(p=>[data,...p]);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-deep">Announcements</h1>
        <p className="muted mt-1">Latest news and notices.</p>
      </header>

      {user?.role === "admin" && <div className="mb-6"><AnnouncementForm onSubmit={handleCreate} /></div>}

      <div className="grid grid-cols-1 gap-4">
        {anns.length===0 ? <div className="p-6 rounded-lg bg-white/30 border">No announcements yet.</div> : anns.map(a=>(
          <div key={a._id} className="spring-in"><AnnouncementCard announcement={a} /></div>
        ))}
      </div>
    </div>
  );
}
