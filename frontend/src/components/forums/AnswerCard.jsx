// src/components/forums/AnswerCard.jsx
import React from "react";
import { forumService } from "../../services/forum.service";
import { xpService } from "../../services/xp.service";
import { gamificationService } from "../../services/gamification.service";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function AnswerCard({ answer, questionId, onUpdated }){
  const { user } = useAuth() || {};

  const upvote = async () => {
    try{
      await forumService.upvoteAnswer(questionId, answer._id, user?.name || "Anon");
      // award XP to answer author (demo)
      xpService.award(answer.author || "anonymous", "upvote_answer");
      onUpdated?.();
    }catch(e){ console.error(e); }
  };

  const accept = async () => {
    if(!user) return alert("login to accept");
    try{
      await forumService.acceptAnswer(questionId, answer._id, user.name);
      // award XP for accepted answer
      xpService.award(answer.author || "anonymous", "accept_answer");
      onUpdated?.();
    }catch(e){ console.error(e); }
  };

  return (
    <div className="p-4 rounded-lg bg-white/90 border shadow-sm flex items-start justify-between card-hover">
      <div>
        <div className="text-sm muted">Answered by <span className="text-deep font-medium">{answer.author}</span> · <span className="muted text-xs">{new Date(answer.createdAt).toLocaleString()}</span></div>
        <div className="mt-2 text-sm">{answer.body}</div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <button onClick={upvote} className="px-3 py-1 rounded-md border text-sm">↑ {answer.votes||0}</button>
        <button onClick={accept} className={`px-3 py-1 rounded-md text-sm ${answer.accepted ? "bg-amber-100 border-amber-300" : "border"}`}>{answer.accepted ? "Accepted" : "Accept"}</button>
      </div>
    </div>
  );
}
