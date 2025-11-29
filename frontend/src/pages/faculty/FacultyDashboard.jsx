// src/pages/faculty/FacultyDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import Toast from "../../components/ui/Toast";
import { useAuth } from "../../hooks/useAuth";

// Faculty Dashboard: Full-featured implementation with faculty-specific student management
export default function FacultyDashboard() {
  // Mock data: Faculty ID (in production, from auth context)
  const facultyId = 'f1';
  const { user, logout } = useAuth() || {};
  const facultyDept = 'Computer Science';
  
  // Mock announcements (faculty-specific)
  const initialAnnouncements = [
    { id: 'a1', title: 'Assignment Due', body: 'Submit assignment by Friday.', createdAt: Date.now() - 1000 * 60 * 60 * 24, facultyId }
  ];

  // Mock events (faculty-specific)
  const initialEvents = [
    { id: 'e1', title: 'Lab Session 1', place: 'Lab 3', time: 'Mon 10 AM', description: 'Data Structures Lab', facultyId, attendees: ['s1', 's2'] },
    { id: 'e2', title: 'Seminar: Advanced Topics', place: 'Hall A', time: 'Wed 2 PM', description: 'Expert lecture', facultyId, attendees: [] }
  ];

  // Mock students (assigned to this faculty's department)
  const initialStudents = [
    { id: 's1', studentId: '2025CS001', name: 'Arjun Singh', email: 'arjun@college.edu', branch: 'Computer Science', year: '2nd', xp: 1200, department: 'Computer Science', enrolledEvents: ['e1'], bookings: [{ id: 'b1', itemName: 'Data Structures Book', issueDate: '2025-11-20', returnDate: '2025-12-20', mrp: 450 }], equipments: [] },
    { id: 's2', studentId: '2025CS002', name: 'Neha Rao', email: 'neha@college.edu', branch: 'Computer Science', year: '2nd', xp: 980, department: 'Computer Science', enrolledEvents: ['e1'], bookings: [{ id: 'b2', itemName: 'Algorithms Book', issueDate: '2025-11-15', returnDate: '2025-12-15', mrp: 550 }], equipments: [{ name: 'Laptop' }] },
    { id: 's3', studentId: '2025CS003', name: 'Rohit Kumar', email: 'rohit@college.edu', branch: 'Computer Science', year: '1st', xp: 1450, department: 'Computer Science', enrolledEvents: [], bookings: [], equipments: [] },
    { id: 's4', studentId: '2025CS004', name: 'Mitul Rishi', email: 'mitul@college.edu', branch: 'Computer Science', year: '2nd', xp: 1500, department: 'Computer Science', enrolledEvents: ['e2'], bookings: [{ id: 'b2', itemName: 'Data Structures Book', issueDate: '2025-11-20', returnDate: '2025-12-20', mrp: 450 }], equipments: [{ name: 'CPU' }] },
    { id: 's5', studentId: '2025CS005', name: 'Rudraksh Sharma', email: 'rudra@college.edu', branch: 'Computer Science', year: '2nd', xp: 880, department: 'Computer Science', enrolledEvents: ['e2'], bookings: [{ id: 'b2', itemName: 'Algorithms Book', issueDate: '2025-11-15', returnDate: '2025-12-15', mrp: 550 }], equipments: [{ name: 'Laptop' }] },
    
  ];

  // State
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [events, setEvents] = useState(initialEvents);
  const [students, setStudents] = useState(initialStudents);

  // UI state
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [queryStudentId, setQueryStudentId] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [leaderboardLive, setLeaderboardLive] = useState(true);

  // Toast helper
  const notify = (message, type = 'success') => setToast({ open: true, message, type });

  // Announcements CRUD
  function createAnnouncement(payload) {
    const ann = { id: `a${Date.now()}`, ...payload, createdAt: Date.now(), facultyId };
    setAnnouncements((s) => [ann, ...s]);
    notify('Announcement created');
  }
  function updateAnnouncement(id, payload) {
    setAnnouncements((s) => s.map(a => a.id === id ? { ...a, ...payload } : a));
    notify('Announcement updated');
  }
  function deleteAnnouncement(id) {
    setAnnouncements((s) => s.filter(a => a.id !== id));
    notify('Announcement deleted', 'info');
  }

  // Events CRUD
  function createEvent(payload) {
    const ev = { id: `e${Date.now()}`, attendees: [], facultyId, ...payload };
    setEvents((s) => [ev, ...s]);
    notify('Event created');
  }
  function updateEvent(id, payload) {
    setEvents((s) => s.map(e => e.id === id ? { ...e, ...payload } : e));
    notify('Event updated');
  }
  function deleteEvent(id) {
    setEvents((s) => s.filter(e => e.id !== id));
    // remove from student enrollments
    setStudents((st) => st.map(x => ({ ...x, enrolledEvents: x.enrolledEvents.filter(ev => ev !== id) })));
    notify('Event deleted', 'info');
  }

  // Student search by Student ID (only students under this faculty's department)
  function searchStudentByStudentId(studentId) {
    const found = students.find(s => s.studentId.toLowerCase() === studentId.trim().toLowerCase());
    if (!found) {
      setSelectedStudent(null);
      notify('Student not found in your department', 'error');
    } else {
      setSelectedStudent(found);
    }
  }

  // Leaderboard computed from students by xp (top 10)
  const leaderboard = useMemo(() => {
    return [...students].sort((a, b) => b.xp - a.xp).slice(0, 10);
  }, [students]);

  // Simulate live updates for leaderboard if enabled
  useEffect(() => {
    if (!leaderboardLive) return;
    const iv = setInterval(() => {
      setStudents((prev) => prev.map((s) => {
        if (Math.random() > 0.85) return { ...s, xp: s.xp + Math.floor(Math.random() * 40) };
        return s;
      }));
    }, 3000);
    return () => clearInterval(iv);
  }, [leaderboardLive]);

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>{`
        @keyframes gentle-float { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-gentle-float { animation: gentle-float 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        
        @keyframes subtle-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.95; } }
        .animate-subtle-pulse { animation: subtle-pulse 3s ease-in-out infinite; }
        
        @keyframes smooth-scale { 0% { transform: scale(0.98); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-smooth-scale { animation: smooth-scale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        
        @keyframes fade-slide { 0% { opacity: 0; transform: translateX(-12px); } 100% { opacity: 1; transform: translateX(0); } }
        .animate-fade-slide { animation: fade-slide 0.7s ease-out; }
        
        .card-hover { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08); }
      `}</style>

      <header className="max-w-6xl mx-auto mb-16 relative">
        <div className="absolute -inset-12 bg-gradient-to-r from-indigo-200 via-purple-100 to-blue-200 rounded-3xl blur-3xl opacity-20 -z-10"></div>
        
        <div className="flex items-center justify-between mb-8">
          <div className="animate-gentle-float">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">Faculty Dashboard</h1>
            <p className="text-slate-600 mt-4 text-lg font-medium">Welcome, <span className="font-bold text-indigo-700">{user.name}</span> <span className="mx-2 text-slate-400">•</span> <span className="text-purple-700 font-semibold">{facultyDept}</span></p>
          </div>

          <div className="flex items-center gap-4 animate-fade-slide">
            <button onClick={() => { setShowAnnModal(true); setEditingAnn(null); }} className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold shadow-lg shadow-indigo-300/40 hover:shadow-xl hover:shadow-indigo-300/60 hover:scale-105 transition-all duration-300">
              Post Announcement
            </button>
            <button onClick={() => { setShowEventModal(true); setEditingEvent(null); }} className="px-6 py-3 rounded-xl border-2 border-purple-400 bg-white text-purple-600 font-semibold hover:bg-purple-50 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-200/40 transition-all duration-300">
            Create Event
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Summary tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProfessionalTile title="My Students" value={students.length} gradient="from-indigo-500 to-indigo-600" icon="👥" delay="0ms" />
          <ProfessionalTile title="Announcements" value={announcements.length} gradient="from-purple-500 to-purple-600" icon="📢" delay="80ms" />
          <ProfessionalTile title="Events" value={events.length} gradient="from-blue-500 to-blue-600" icon="📅" delay="160ms" />
          <ProfessionalTile title="Avg. Class XP" value={Math.round(students.reduce((s, x) => s + x.xp, 0) / students.length)} gradient="from-teal-500 to-teal-600" icon="⭐" delay="240ms" />
        </div>

        {/* Main content */}
        <section className="space-y-10">
          {/* Announcements */}
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-indigo-200/30 card-hover border border-indigo-100 animate-gentle-float">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-indigo-100">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">📣 Announcements</h2>
              </div>
              <div className="text-sm text-slate-600 bg-indigo-50 px-4 py-2 rounded-lg font-semibold">Total: <span className="text-indigo-700">{announcements.length}</span></div>
            </div>

            <div className="space-y-3">
              {announcements.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <div className="text-lg">No announcements yet</div>
                </div>
              ) : (
                announcements.map((a, idx) => (
                  <div key={a.id} style={{animationDelay: `${idx * 100}ms`}} className="p-5 rounded-xl border border-indigo-100 hover:border-indigo-300 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 card-hover animate-gentle-float">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-bold text-indigo-700 text-lg">{a.title}</div>
                        <div className="text-slate-700 mt-2 leading-relaxed">{a.body}</div>
                        <div className="text-xs text-slate-500 mt-3">{new Date(a.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button onClick={() => { setEditingAnn(a); setShowAnnModal(true); }} className="px-3 py-1 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition duration-300 transform hover:scale-105">Edit</button>
                        <button onClick={() => deleteAnnouncement(a.id)} className="px-3 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition duration-300 transform hover:scale-105">Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Events */}
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-purple-200/30 card-hover border border-purple-100 animate-gentle-float" style={{animationDelay: '80ms'}}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-100">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">🎯 My Events</h2>
              </div>
              <div className="text-sm text-slate-600 bg-purple-50 px-4 py-2 rounded-lg font-semibold">Total: <span className="text-purple-700">{events.length}</span></div>
            </div>

            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <div className="text-lg">No events created yet</div>
                </div>
              ) : (
                events.map((ev, idx) => (
                  <div key={ev.id} style={{animationDelay: `${idx * 100}ms`}} className="p-5 rounded-xl border border-purple-100 hover:border-purple-300 bg-gradient-to-r from-purple-50/50 to-pink-50/50 card-hover animate-gentle-float">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-bold text-purple-700 text-lg">{ev.title}</div>
                        <div className="text-slate-700 mt-2">{ev.time} • 📍 {ev.place}</div>
                        <div className="text-sm text-slate-600 mt-2">{ev.description}</div>
                        <div className="text-xs text-slate-600 mt-3">Enrolled: <span className="font-semibold text-purple-700">{ev.attendees?.length || 0}</span> students</div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button onClick={() => { setEditingEvent(ev); setShowEventModal(true); }} className="px-3 py-1 rounded-md text-xs font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200 transition duration-300 transform hover:scale-105">Edit</button>
                        <button onClick={() => deleteEvent(ev.id)} className="px-3 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition duration-300 transform hover:scale-105">Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Student Search & Details */}
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-teal-200/30 card-hover border border-teal-100 animate-gentle-float" style={{animationDelay: '160ms'}}>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">🔍 Search Student Records</h2>

            <div className="flex gap-3 mb-6">
              <input value={queryStudentId} onChange={(e) => setQueryStudentId(e.target.value)} placeholder="Enter Student ID (e.g., 2025CS001)" className="flex-1 px-4 py-3 border-2 border-teal-200 rounded-lg bg-teal-50 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 font-medium" />
              <button onClick={() => searchStudentByStudentId(queryStudentId)} className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-teal-300/40 hover:scale-105 transition-all duration-300">Search</button>
            </div>

            {selectedStudent ? (
              <div className="p-6 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200 hover:border-teal-300 transition-all duration-300">
                {/* Student Header */}
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-teal-200">
                  <div>
                    <div className="text-4xl font-black bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">{selectedStudent.name}</div>
                    <div className="text-sm text-slate-600 mt-2">{selectedStudent.studentId} • {selectedStudent.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-600 font-medium">XP Points</div>
                    <div className="text-4xl font-black bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">{selectedStudent.xp}</div>
                  </div>
                </div>

                {/* Student Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-white border-2 border-teal-100 hover:border-teal-300 transition-all duration-300">
                    <div className="text-xs font-bold text-slate-600">BRANCH</div>
                    <div className="text-xl font-bold text-teal-700 mt-2">{selectedStudent.branch}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white border-2 border-purple-100 hover:border-purple-300 transition-all duration-300">
                    <div className="text-xs font-bold text-slate-600">YEAR</div>
                    <div className="text-xl font-bold text-purple-700 mt-2">{selectedStudent.year}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300">
                    <div className="text-xs font-bold text-slate-600">DEPARTMENT</div>
                    <div className="text-xl font-bold text-indigo-700 mt-2">{selectedStudent.department}</div>
                  </div>
                </div>

                {/* Enrollments */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-purple-700 mb-3 flex items-center gap-2">
                    <span>📚</span>
                    Event Enrollments
                  </h4>
                  {selectedStudent.enrolledEvents.length === 0 ? (
                    <div className="text-slate-500">No event enrollments</div>
                  ) : (
                    <ul className="space-y-2">
                      {selectedStudent.enrolledEvents.map(eid => {
                        const ev = events.find(x => x.id === eid);
                        return (
                          <li key={eid} className="p-3 rounded-lg bg-white border-2 border-purple-100 hover:border-purple-300 hover:shadow-md hover:shadow-purple-200/30 transition-all duration-300">
                            <div className="flex justify-between">
                              <span className="font-semibold text-slate-700">{ev?.title || eid}</span>
                              <span className="text-xs text-slate-500 font-medium">{ev?.time}</span>
                            </div>
                            <div className="text-sm text-slate-600 mt-1">{ev?.place}</div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Bookings - Detailed */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-teal-700 mb-3 flex items-center gap-2">
                    <span>📖</span>
                    Resource Bookings
                  </h4>
                  {selectedStudent.bookings.length === 0 ? (
                    <div className="text-slate-500">No resource bookings</div>
                  ) : (
                    <div className="space-y-3">
                      {selectedStudent.bookings.map((b) => (
                        <div key={b.id} className="p-4 rounded-lg bg-white border-2 border-teal-100 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-200/30 transition-all duration-300">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold text-teal-700">{b.itemName}</div>
                              <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                                <div><span className="text-slate-600 font-medium">Issued:</span> <span className="font-semibold text-slate-800">{b.issueDate}</span></div>
                                <div><span className="text-slate-600 font-medium">Return:</span> <span className="font-semibold text-slate-800">{b.returnDate}</span></div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-slate-600 font-medium">MRP</div>
                              <div className="text-lg font-bold text-emerald-600">₹{b.mrp}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Equipment */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-orange-600 mb-3 flex items-center gap-2">
                    <span>⚙️</span>
                    Equipment Issued
                  </h4>
                  {selectedStudent.equipments.length === 0 ? (
                    <div className="text-slate-500">No equipment issued</div>
                  ) : (
                    <ul className="space-y-2">
                      {selectedStudent.equipments.map((q, i) => (
                        <li key={i} className="p-3 rounded-lg bg-white border-2 border-orange-100 hover:border-orange-300 transition-all">• {q.name}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex gap-3 pt-6 border-t border-teal-200">
                  <button onClick={() => { navigator.clipboard?.writeText(selectedStudent.studentId); notify('Student ID copied'); }} className="px-4 py-2 text-sm rounded-lg border-2 border-teal-200 hover:border-teal-500 text-teal-700 hover:bg-teal-50 transition-all duration-300 font-medium">Copy ID</button>
                  <button onClick={() => { setSelectedStudent(null); setQueryStudentId(''); }} className="px-4 py-2 text-sm rounded-lg border-2 border-slate-200 hover:border-slate-400 text-slate-700 hover:bg-slate-50 transition-all duration-300 font-medium">Close</button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500">
                <div className="text-2xl">🔎 Search by Student ID to view detailed records</div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Full-width Leaderboard at the bottom */}
      <section className="w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-16 mt-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/30 via-purple-100/20 to-indigo-100/30 -z-10"></div>
        
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 shadow-lg shadow-indigo-200/40 card-hover border border-indigo-100 animate-gentle-float" style={{animationDelay: '240ms'}}>
            <div className="flex  items-center justify-between mb-8 pb-6 border-b border-indigo-100">
              <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">🏆 Class Leaderboard</h2>
              <div className="flex items-center gap-4">
                <label className="text-sm text-slate-700 font-semibold">Live Updates</label>
                <button onClick={() => setLeaderboardLive(!leaderboardLive)} className={`px-5 py-2 rounded-lg font-semibold transition-all duration-300 transform ${leaderboardLive ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-300/40 scale-105' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>
                  {leaderboardLive ? '🔴 LIVE' : '⚪ OFF'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leaderboard.map((s, idx) => (
                <div key={s.id} style={{animationDelay: `${idx * 100}ms`}} className="animate-gentle-float p-6 rounded-2xl bg-gradient-to-br from-white to-indigo-50 border-2 border-indigo-100 hover:border-indigo-300 card-hover group cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-300/50 group-hover:shadow-indigo-400/80 transition-all duration-300 group-hover:scale-110">
                      #{idx+1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 truncate group-hover:text-indigo-700 transition-colors">{s.name}</div>
                      <div className="text-xs text-slate-500 truncate font-medium">{s.studentId}</div>
                    </div>
                  </div>
                  <div className="flex items-end justify-between pt-3 border-t border-indigo-100">
                    <div>
                      <div className="text-xs text-slate-600 font-bold">XP POINTS</div>
                      <div className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:to-purple-500 transition-all">{s.xp}</div>
                    </div>
                    <div className="text-2xl group-hover:scale-150 transition-transform duration-300">⭐</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Announcement Modal */}
      {showAnnModal && (
        <Modal onClose={() => { setShowAnnModal(false); setEditingAnn(null); }}>
          <AnnForm
            initial={editingAnn}
            onCancel={() => { setShowAnnModal(false); setEditingAnn(null); }}
            onSave={(payload) => {
              if (editingAnn) updateAnnouncement(editingAnn.id, payload);
              else createAnnouncement(payload);
              setShowAnnModal(false);
              setEditingAnn(null);
            }}
          />
        </Modal>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <Modal onClose={() => { setShowEventModal(false); setEditingEvent(null); }}>
          <EventForm
            initial={editingEvent}
            onCancel={() => { setShowEventModal(false); setEditingEvent(null); }}
            onSave={(payload) => {
              if (editingEvent) updateEvent(editingEvent.id, payload);
              else createEvent(payload);
              setShowEventModal(false);
              setEditingEvent(null);
            }}
          />
        </Modal>
      )}

      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, open: false })} />
    </div>
  );
}

/* ---------- UI Components ---------- */
function ProfessionalTile({ title, value, gradient, icon, delay }) {
  return (
    <div style={{animationDelay: delay}} className={`animate-gentle-float rounded-2xl p-6 text-white shadow-lg transition-all duration-400 bg-gradient-to-br ${gradient} group cursor-pointer relative overflow-hidden hover:shadow-2xl hover:shadow-indigo-300/30 hover:-translate-y-2`}>
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold opacity-90 uppercase tracking-wider">{title}</div>
          <div className="text-5xl font-black mt-3 group-hover:scale-110 transition-transform duration-400 origin-left">{value}</div>
        </div>
        <div className="text-5xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-400">{icon}</div>
      </div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white p-8 shadow-2xl shadow-indigo-200/30 animate-smooth-scale relative overflow-hidden rounded-2xl border-2 border-indigo-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 text-3xl transition-colors duration-300 hover:scale-110">✕</button>
        {children}
      </div>
    </div>
  );
}

function AnnForm({ initial, onCancel, onSave }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [body, setBody] = useState(initial?.body || '');
  return (
    <div>
      <h3 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-6">
        {initial ? '✏️ Edit Announcement' : '✨ Create Announcement'}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">TITLE</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg bg-indigo-50 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 font-medium" placeholder="Announcement Title" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">MESSAGE</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg bg-indigo-50 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 font-medium h-40" placeholder="Message body..." />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onCancel} className="px-6 py-2 rounded-lg border-2 border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 font-semibold">Cancel</button>
        <button onClick={() => onSave({ title, body })} className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-300/40 hover:scale-105 transition-all duration-300">Save</button>
      </div>
    </div>
  );
}

function EventForm({ initial, onCancel, onSave }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [place, setPlace] = useState(initial?.place || '');
  const [time, setTime] = useState(initial?.time || '');
  const [description, setDescription] = useState(initial?.description || '');
  return (
    <div>
      <h3 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
        {initial ? '✏️ Edit Event' : '✨ Create Event'}
      </h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">EVENT TITLE</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg bg-purple-50 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-medium" placeholder="Event title" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">LOCATION</label>
          <input value={place} onChange={(e) => setPlace(e.target.value)} className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg bg-purple-50 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-medium" placeholder="Location/Place" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">DATE & TIME</label>
          <input value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg bg-purple-50 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-medium" placeholder="Date & Time (e.g., Mon 10 AM)" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">DESCRIPTION</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg bg-purple-50 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-medium h-32" placeholder="Event description..." />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onCancel} className="px-6 py-2 rounded-lg border-2 border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 font-semibold">Cancel</button>
        <button onClick={() => onSave({ title, place, time, description })} className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-300/40 hover:scale-105 transition-all duration-300">Save</button>
      </div>
    </div>
  );
}