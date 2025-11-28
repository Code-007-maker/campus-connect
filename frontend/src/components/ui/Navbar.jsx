import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import VoiceNav from "./VoiceNav";

export default function Navbar(){
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <header className="fixed w-full top-0 z-50 transition-all bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center  gap-40">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white accent-gradient font-bold">CC</div>
            <div className="text-deep font-semibold mx-4 ml-1 text-md">Campus<span className="text-[var(--accent-mid)] text-md">Connect</span></div>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link to="/announcements" className={pathname.startsWith('/announcements') ? "text-[var(--accent-mid)] font-medium" : "muted" }>Announcements</Link>
            <Link to="/calendar" className={pathname.startsWith('/calendar') ? "text-[var(--accent-mid)] font-medium" : "muted"}>Calendar</Link>
             <Link to="/chats" className={pathname.startsWith('/chats') ? "text-[var(--accent-mid)] font-medium" : "muted"}>Group Chat</Link>
              <Link to="/matchmaking" className={pathname.startsWith('/matchmaking') ? "text-[var(--accent-mid)] font-medium" : "muted"}>Project Making</Link>
            <Link to="/resources" className={pathname.startsWith('/resources') ? "text-[var(--accent-mid)] font-medium" : "muted"}>Resources</Link>
            <Link to="/leaderboard" className={pathname.startsWith('/leaderboard') ? "text-[var(--accent-mid)] font-medium" : "muted"}>Gemification</Link>
          </nav>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="text-sm muted hidden sm:block">{user.name} · <span className="font-medium">{user.role}</span></div>
              <button 
                onClick={logout} 
                className="px-5 py-2.5 mr-4 rounded-lg bg-gradient-to-r from-indigo-600 to-teal-500 text-white text-sm font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Logout
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm hover:underline">Login</Link>
              <Link to="/register" className="btn-cta py-2 px-3 rounded-md text-sm">Sign up</Link>
            </>
          )}
          </div>
          <div className="flex items-center gap-3 mt-2 justify-center">
            <LanguageToggle/>
            <ThemeToggle />
            <VoiceNav />
          </div>
        </div>

      </div>
    </header>
  );
}
