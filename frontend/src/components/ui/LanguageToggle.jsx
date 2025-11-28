import React, { useState, useEffect } from "react";
export default function LanguageToggle(){
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  useEffect(()=> localStorage.setItem("lang", lang), [lang]);
  return (
    <div className="flex items-center gap-2">
      <button onClick={()=>setLang("en")} className={`px-2 py-1 rounded-md ${lang==="en"?"bg-slate-100":"hover:bg-slate-50"} text-sm`}>EN</button>
      <button onClick={()=>setLang("hi")} className={`px-2 py-1 rounded-md ${lang==="hi"?"bg-slate-100":"hover:bg-slate-50"} text-sm`}>HI</button>
    </div>
  );
}
