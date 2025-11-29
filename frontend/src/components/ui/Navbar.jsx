// src/components/ui/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import ThemeToggle from "./ThemeToggle";
import VoiceNav from "./VoiceNav";
import { useTranslation } from "../../i18n/index.jsx";

export default function Navbar() {
  const { user, logout } = useAuth() || {};
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <header className="fixed w-full top-0 z-50 transition-all bg-white/80 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(90deg,#6366F1,#06B6D4)" }}>
              CC
            </div>
            <div className="leading-tight">
              <div className="text-deep font-semibold text-lg">Campus<span className="text-[var(--accent-mid)]">Connect</span></div>
              <div className="text-xs text-slate-400">Campus hub & student life</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/announcements" className={pathname.startsWith('/announcements') ? "text-[var(--accent-mid)] font-medium" : "text-slate-600 hover:text-deep transition"}>
              {t("nav.announcements")}
            </Link>

            <Link to="/calendar" className={pathname.startsWith('/calendar') ? "text-[var(--accent-mid)] font-medium" : "text-slate-600 hover:text-deep transition"}>
              {t("nav.calendar")}
            </Link>

            <Link to="/chats" className={pathname.startsWith('/chats') ? "text-[var(--accent-mid)] font-medium" : "text-slate-600 hover:text-deep transition"}>
              {t("nav.chats")}
            </Link>

            <Link to="/matchmaking" className={pathname.startsWith('/matchmaking') ? "text-[var(--accent-mid)] font-medium" : "text-slate-600 hover:text-deep transition"}>
              {t("nav.matchmaking")}
            </Link>

            <Link to="/resources" className={pathname.startsWith('/resources') ? "text-[var(--accent-mid)] font-medium" : "text-slate-600 hover:text-deep transition"}>
              {t("nav.resources")}
            </Link>

            <Link to="/leaderboard" className={pathname.startsWith('/leaderboard') ? "text-[var(--accent-mid)] font-medium" : "text-slate-600 hover:text-deep transition"}>
              {t("nav.leaderboard")}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <VoiceNav />
          </div>

          <div>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-600 hidden sm:block">{user.name} · <span className="font-medium text-slate-800">{user.role}</span></div>
                <button
                  onClick={logout}
                  className="relative overflow-hidden px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-teal-500 text-white text-sm font-semibold shadow hover:scale-[1.02] transition-transform duration-200"
                >
                  {t("auth.logout")}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm text-slate-600 hover:underline">{t("auth.login")}</Link>
                <Link to="/register" className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:shadow-lg transition">{t("auth.signup")}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}