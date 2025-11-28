// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import Toast from "../components/ui/Toast";

const EVENTS = [
  { id: "e1", title: "Interstellar Astronomy Talk", time: "Mon, Dec 9 • 3:00 PM — 4:30 PM", place: "Auditorium", description: "Speaker: Prof. K. Sharma", registered: false },
  { id: "e2", title: "Hackathon Workshop: Git & Collab", time: "Wed, Dec 11 • 11:00 AM — 12:30 PM", place: "Lab 3", description: "Hands-on Git & PRs", registered: false }
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState(EVENTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });
  const [stats, setStats] = useState({ projects: 0, clubs: 0, members: 0, events: 0 });
  const [hoveredNav, setHoveredNav] = useState(null);

  useEffect(() => {
    const targets = { projects: 12, clubs: 45, members: 1200, events: 8 };
    const duration = 900;
    const stepTime = 30;
    const steps = Math.ceil(duration / stepTime);
    const inc = {
      projects: Math.ceil(targets.projects / steps),
      clubs: Math.ceil(targets.clubs / steps),
      members: Math.ceil(targets.members / steps),
      events: Math.ceil(targets.events / steps),
    };
    let cur = { projects: 0, clubs: 0, members: 0, events: 0 };
    const iv = setInterval(() => {
      cur = {
        projects: Math.min(targets.projects, cur.projects + inc.projects),
        clubs: Math.min(targets.clubs, cur.clubs + inc.clubs),
        members: Math.min(targets.members, cur.members + inc.members),
        events: Math.min(targets.events, cur.events + inc.events),
      };
      setStats(cur);
      if (cur.projects === targets.projects && cur.clubs === targets.clubs && cur.members === targets.members && cur.events === targets.events) clearInterval(iv);
    }, stepTime);
    return () => clearInterval(iv);
  }, []);

  const openRegister = (ev) => { setSelected(ev); setModalOpen(true); };
  const confirmRegister = () => {
    if (!selected) return;
    setEvents((prev) => prev.map((p) => (p.id === selected.id ? { ...p, registered: true } : p)));
    setModalOpen(false);
    setToast({ open: true, message: `Registered for "${selected.title}"`, type: "success" });
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <style>{`
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient-shift { background-size: 200% 200%; animation: gradient-shift 8s ease infinite; }
        
        @keyframes float-in { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-float-in { animation: float-in 0.6s ease-out forwards; }
        
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); } 50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); } }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        
        @keyframes slide-down { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-slide-down { animation: slide-down 0.4s ease-out; }
        
        @keyframes pop { from { transform: translateY(12px) scale(.92); opacity: 0 } to { transform: translateY(0) scale(1); opacity: 1 } }
        .animate-pop { animation: pop 0.35s cubic-bezier(.16, 1, .3, 1); }
        
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
        .animate-shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent); background-size: 1000px 100%; animation: shimmer 2s infinite; }
        
        @keyframes glow-border { 0% { border-color: rgba(99, 102, 241, 0); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.1); } 50% { border-color: rgba(99, 102, 241, 0.5); box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); } 100% { border-color: rgba(99, 102, 241, 0); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.1); } }
        .animate-glow-border { animation: glow-border 2s ease-in-out infinite; }

        .nav-link-hover { @apply relative; }
        .nav-link-hover::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 2px; background: linear-gradient(90deg, #4f46e5, #14b8a6); transition: width 0.3s ease; }
        .nav-link-hover:hover::after { width: 100%; }
      `}</style>

      {/* Top Navbar - Premium */}
      

      {/* Hero Section - Premium */}
      <section className="relative pt-8 pb-16 px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-30"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-30" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 animate-float-in">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/40 backdrop-blur-sm hover:shadow-3xl transition-all duration-500">
            <div className="relative p-12 md:p-20 bg-gradient-to-br from-indigo-600 via-teal-500 to-emerald-400 text-white text-center animate-gradient-shift">
              {/* Shimmer Effect */}
              <div className="absolute inset-0 animate-shimmer pointer-events-none"></div>
              
              <div className="relative z-10">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight drop-shadow-lg">
                  CampusConnect
                </h1>
                <p className="mt-3 text-lg md:text-2xl font-semibold opacity-95 drop-shadow">
                  Connect • Learn • Build Together
                </p>
                <p className="mt-6 max-w-3xl mx-auto text-base md:text-lg text-white/95 leading-relaxed drop-shadow">
                  Discover campus events, reserve resources, join clubs and collaborate with peers — all in one polished, secure and modern portal designed for students and faculty.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/resources" 
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-indigo-700 font-bold shadow-xl hover:shadow-2xl hover:scale-110 transform transition-all duration-300 group hover:bg-slate-50"
                  >
                    <span className="text-xl group-hover:scale-125 transition-transform duration-300">→</span>
                    Get Started
                  </Link>
                  <Link 
                    to="/announcements" 
                    className="inline-flex items-center justify-center px-8 py-4 rounded-full border-3 border-white text-white font-bold hover:bg-white/20 hover:scale-110 transform transition-all duration-300 backdrop-blur-sm"
                  >
                    📢 View Announcements
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Row - Premium */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 animate-float-in">Campus Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Active Projects", value: stats.projects, icon: "📊", color: "indigo", delay: "0ms" },
              { label: "Clubs & Societies", value: stats.clubs, icon: "🎯", color: "teal", delay: "100ms" },
              { label: "Community Members", value: stats.members.toLocaleString(), icon: "👥", color: "emerald", delay: "200ms" },
              { label: "Upcoming Events", value: stats.events, icon: "🎉", color: "amber", delay: "300ms" }
            ].map((stat, idx) => (
              <div 
                key={idx}
                style={{animationDelay: stat.delay}}
                className="animate-float-in p-6 rounded-2xl bg-white border-2 border-slate-100 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-indigo-300 group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-teal-50/0 group-hover:from-indigo-50 group-hover:to-teal-50 transition-colors duration-300 -z-10"></div>
                
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className={`text-sm font-bold text-${stat.color}-600`}>{stat.label}</div>
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
                <div className={`text-4xl font-black text-${stat.color}-700 group-hover:scale-110 transition-transform duration-300 origin-left`}>
                  {stat.value}
                </div>
                <div className={`mt-2 h-1 w-12 bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600 rounded-full group-hover:w-24 transition-all duration-300`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Events & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Events */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300 animate-float-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">📅</span>
              Upcoming Events
            </h2>

            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p className="text-lg font-medium">No upcoming events</p>
                </div>
              ) : (
                events.map((ev, idx) => (
                  <div 
                    key={ev.id}
                    style={{animationDelay: `${idx * 50}ms`}}
                    className="animate-float-in p-6 rounded-xl border-2 border-slate-100 bg-gradient-to-r from-white to-slate-50 hover:from-indigo-50 hover:to-teal-50 hover:border-indigo-300 transition-all duration-300 flex justify-between items-start group cursor-pointer shadow-sm hover:shadow-lg"
                  >
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors duration-300">{ev.title}</div>
                      <div className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                        <span>🕐</span>
                        {ev.time}
                      </div>
                      <div className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                        <span>📍</span>
                        {ev.place}
                      </div>
                      <div className="text-xs text-slate-400 mt-2">{ev.description}</div>
                    </div>

                    <div className="flex flex-col items-end gap-3 ml-4">
                      <button 
                        onClick={() => openRegister(ev)} 
                        disabled={ev.registered}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform ${ev.registered 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-indigo-600 to-teal-500 text-white shadow-md hover:shadow-lg hover:scale-110 hover:-translate-y-1'
                        }`}
                      >
                        {ev.registered ? '✓ Registered' : '✨ Register'}
                      </button>
                      <Link 
                        to="/calendar" 
                        className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 hover:underline underline-offset-2 transition-all duration-300"
                      >
                        View Calendar →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions & Community */}
          <aside className="bg-gradient-to-br from-indigo-50 via-teal-50 to-emerald-50 rounded-2xl p-8 shadow-lg border-2 border-indigo-100 hover:shadow-2xl transition-all duration-300 animate-float-in" style={{animationDelay: '200ms'}}>
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Quick Actions
            </h3>
            
            <ul className="space-y-3 mb-6">
              {[
                { label: "📚 Book a Study Room", to: "/resources" },
                { label: "📢 Post Announcement", to: "/announcements" },
                { label: "📅 Open Calendar", to: "/calendar" }
              ].map((action, idx) => (
                <li key={idx}>
                  <Link 
                    to={action.to} 
                    className="block p-3 text-indigo-700 hover:text-indigo-900 font-semibold transition-all duration-300 rounded-lg hover:bg-indigo-100/50 hover:scale-105 origin-left transform"
                  >
                    {action.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-6 border-t-2 border-indigo-200">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Active Community</h4>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['A', 'B', 'C'].map((letter, i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm border-3 border-white shadow-lg hover:scale-125 hover:z-20 transition-all duration-300 cursor-pointer"
                      style={{
                        backgroundColor: i === 0 ? '#4f46e5' : i === 1 ? '#14b8a6' : '#10b981',
                        animationDelay: `${i * 100}ms`
                      }}
                    >
                      {letter}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs border-3 border-white shadow-lg">
                    +5
                  </div>
                </div>
                <span className="text-sm text-slate-600 font-medium">8 online</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-white/30 animate-pop hover:shadow-3xl transition-shadow duration-300">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-slate-800">✨ Register Event</h3>
                <p className="text-sm text-slate-600 mt-2 font-medium">{selected?.title}</p>
              </div>
              <button 
                onClick={() => { setModalOpen(false); setSelected(null); }} 
                className="text-slate-400 hover:text-slate-600 hover:scale-125 transition-all duration-300 text-3xl"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600 mb-8 leading-relaxed">Confirm your registration for this event. Your registration will be saved locally.</p>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setModalOpen(false); setSelected(null); }} 
                className="px-5 py-3 rounded-lg border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 hover:scale-105"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRegister} 
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, open: false })} />
    </div>
  );
}
      
