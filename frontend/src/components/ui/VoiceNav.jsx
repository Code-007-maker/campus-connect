import React, { useState } from "react";

export default function VoiceNav(){
  const [listening, setListening] = useState(false);
  const start = async () => {
    if(!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)){ alert("Voice not supported"); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = localStorage.getItem("lang") === "hi" ? "hi-IN" : "en-US";
    r.onresult = (e) => {
      const text = e.results[0][0].transcript.toLowerCase();
      // naive navigation:
      if(text.includes("announcement")||text.includes("announcements")) window.location.href="/announcements";
      if(text.includes("calendar")) window.location.href="/calendar";
      if(text.includes("resource")||text.includes("book")) window.location.href="/resources";
    };
    r.onend = ()=> setListening(false);
    r.start();
    setListening(true);
  };

  return (
    <button onClick={start} className={`px-3 py-2 rounded-md border hover:bg-slate-50 transition ${listening?"bg-sky-50":""}`}>🎙️</button>
  );
}
