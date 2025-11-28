// src/pages/ForumThread.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { forumService } from "../services/forum.service";
import Composer from "../components/forums/Composer";
import AnswerCard from "../components/forums/AnswerCard";
import { useAuth } from "../hooks/useAuth.jsx";

export default function ForumThread(){
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const { user } = useAuth() || {};

  const load = async () => setThread(await forumService.get(id));

  useEffect(()=>{ load(); }, [id]);

  if(!thread) return <div className="pt-28 p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="glass p-6 rounded-2xl border" style={{ borderColor:"var(--glass-border)" }}>
        <h1 className="text-2xl font-bold text-deep">{thread.title}</h1>
        <div className="muted mt-2">{thread.body}</div>
        <div className="text-xs muted mt-3">By <span className="text-deep font-medium">{thread.author}</span> · {new Date(thread.createdAt).toLocaleString()}</div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Answers</h3>
        <div className="mt-4 space-y-3">
          {thread.answers && thread.answers.length > 0 ? thread.answers.map(a => (
            <AnswerCard key={a._id} answer={a} questionId={thread._id} onUpdated={load} />
          )) : <div className="muted">No answers yet — be the first to help!</div>}
        </div>
      </div>

      <div className="mt-6">
        {user ? <Composer questionId={thread._id} onPosted={load} /> : <div className="p-4 rounded-lg bg-white/50 border muted">Login to answer</div>}
      </div>
    </div>
  );
}
