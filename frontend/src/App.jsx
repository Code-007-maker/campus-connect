import React, { useEffect } from "react";
import AppRouter from "./router/AppRouter";
import Navbar from "./components/ui/Navbar";
import ThemeToggle from "./components/ui/ThemeToggle";
import LanguageToggle from "./components/ui/LanguageSwitcher";
import VoiceNav from "./components/ui/VoiceNav";

export default function App(){
  // persist theme
  useEffect(()=>{
    const dark = localStorage.getItem("theme") === "dark";
    document.documentElement.classList.toggle("dark", dark);
  },[]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 flex justify-end gap-3 mt-4">
          
        </div>
        <main className="p-4">
          <AppRouter />
        </main>
      </div>
    </div>
  );
}
