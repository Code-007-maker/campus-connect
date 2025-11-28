// src/components/forums/ForumList.jsx
import React, { useEffect, useState } from "react";
import { forumService } from "../../services/forum.service";
import ThreadCard from "./ThreadCard";
import Composer from "./Composer";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function ForumList(){
  const [questions, setQuestions] = useState([]);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("All");
  const { user } = useAuth() || {};

  useEffect(()=>{ (async ()=> setQuestions(await forumService.list()) )(); }, []);

  const refresh = async () => setQuestions(await forumService.list());

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-deep">Community Forums</h2>
          <div className="muted">Ask questions, share answers and help peers — earn XP!</div>
        </div>

        <div className="flex gap-2 items-center">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search questions" className="p-2 rounded-md border" />
          <select value={tag} onChange={e=>setTag(e.target.value)} className="p-2 rounded-md border">
            <option>All</option>
            <option>gpu</option><option>lab</option><option>python</option><option>astrophysics</option><option>projects</option>
          </select>
        </div>
      </div>

      {/* composer */}
      {user && <div className="mb-6"><Composer onPosted={refresh} /></div>}

      <div className="grid grid-cols-1 gap-4">
        {questions.filter(t => (tag==="All" || (t.tags||[]).includes(tag)) && (!q || (t.title+t.body).toLowerCase().includes(q.toLowerCase()))).map(qn => (
          <ThreadCard key={qn._id} thread={qn} onUpdate={refresh} />
        ))}
      </div>
    </div>
  );
}
