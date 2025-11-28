// src/components/forums/Composer.jsx
import React, { useState } from "react";
import { forumService } from "../../services/forum.service";
import { useAuth } from "../../hooks/useAuth";
import { emitSocket } from "../../hooks/useSocket"; // helper emitter

export default function Composer({ questionId, onPosted }){
  // if questionId provided => creating an answer; else creating a question
  const { user } = useAuth() || {};
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    if(!body || (!questionId && !title)) return alert("fill fields");
    setLoading(true);
    try{
      if(questionId){
        const ans = await forumService.createAnswer(questionId, { body, author: user?.name || "Anon" });
        onPosted?.(ans);
        // emit socket
        if(window.__campus_bus) window.__campus_bus.dispatchEvent(new CustomEvent("forum:new-answer", { detail: { questionId, answer: ans } }));
      } else {
        const q = await forumService.createQuestion({ title, body, tags: tags.split(",").map(t=>t.trim()).filter(Boolean), author: user?.name || "Anon" });
        onPosted?.(q);
        if(window.__campus_bus) window.__campus_bus.dispatchEvent(new CustomEvent("forum:new-question", { detail: q }));
      }
      setTitle(""); setBody(""); setTags("");
    }catch(err){
      console.error(err); alert("Could not post (demo).");
    }finally{ setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="glass p-4 rounded-2xl border" style={{ borderColor:"var(--glass-border)" }}>
      {!questionId && (
        <div className="mb-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Question title" className="w-full p-3 rounded-md border" />
        </div>
      )}

      <div>
        <textarea value={body} onChange={e=>setBody(e.target.value)} rows={4} placeholder={questionId ? "Write your answer..." : "Describe your question..."} className="w-full p-3 rounded-md border" />
      </div>

      {!questionId && (
        <div className="mt-3">
          <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="tags, comma separated (eg. python,gpu)" className="w-full p-2 rounded-md border" />
        </div>
      )}

      <div className="mt-3 flex justify-end gap-3">
        <button type="button" onClick={()=>{ setTitle(""); setBody(""); setTags(""); }} className="px-3 py-2 rounded-md border">Clear</button>
        <button type="submit" disabled={loading} className="btn-cta px-4 py-2 rounded-md">{loading ? "Posting..." : (questionId ? "Post Answer" : "Post Question")}</button>
      </div>
    </form>
  );
}
