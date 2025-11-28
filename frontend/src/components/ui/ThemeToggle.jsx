import React, { useState, useEffect } from "react";
export default function ThemeToggle(){
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));
  useEffect(()=> { localStorage.setItem("theme", dark ? "dark":"light"); document.documentElement.classList.toggle("dark", dark); }, [dark]);
  return (
    <button onClick={()=>setDark(d=>!d)} className=" px-3 py-2 rounded-md border hover:bg-slate-50 transition">
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
