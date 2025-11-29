// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import Toast from "../../components/ui/Toast";

// Admin Dashboard: Full-featured single-file implementation using local state (mock data)
export default function AdminDashboard() {
  // Mock data
  const initialAnnouncements = [
    { id: 'a1', title: 'Welcome Back!', body: 'Semester starts on Jan 12. Attend orientation.', createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3 },
  ];

  const initialEvents = [
    { id: 'e1', title: 'Hackathon 2025', place: 'Main Hall', time: 'Mar 10 • 9:00 AM', description: '24-hour hackathon', attendees: ['s1', 's2'] },
    { id: 'e2', title: 'Guest Lecture: AI', place: 'Auditorium', time: 'Mar 20 • 2:00 PM', description: 'Prof. X on AI ethics', attendees: [] }
  ];

  const initialFaculty = [
    { id: 'f1', name: 'Dr. Asha Verma', email: 'asha@college.edu', dept: 'Computer Science' },
    { id: 'f2', name: 'Dr. Ravi Patel', email: 'ravi@college.edu', dept: 'Physics' }
  ];

  const initialStudents = [
    { id: 's1', studentId: '2025CS001', name: 'Arjun Singh', email: 'arjun@college.edu', xp: 1200, enrolledEvents: ['e1'], bookings: [{ type: 'book', title: 'Operating Systems Textbook' }], equipments: [{ name: 'Camera' }] },
    { id: 's2', studentId: '2025ME002', name: 'Neha Rao', email: 'neha@college.edu', xp: 980, enrolledEvents: ['e1'], bookings: [], equipments: [] },
    { id: 's3', studentId: '2025CS003', name: 'Rohit Kumar', email: 'rohit@college.edu', xp: 1450, enrolledEvents: [], bookings: [], equipments: [] }
  ];

  // State
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [events, setEvents] = useState(initialEvents);
  const [faculty, setFaculty] = useState(initialFaculty);
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
    const ann = { id: `a${Date.now()}`, ...payload, createdAt: Date.now() };
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
    const ev = { id: `e${Date.now()}`, attendees: [], ...payload };
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

  // Faculty management (basic)
  function addFaculty(payload) {
    setFaculty((f) => [{ id: `f${Date.now()}`, ...payload }, ...f]);
    notify('Faculty added');
  }
  function updateFaculty(id, payload) {
    setFaculty((f) => f.map(x => x.id === id ? { ...x, ...payload } : x));
    notify('Faculty updated');
  }
  function deleteFaculty(id) {
    setFaculty((f) => f.filter(x => x.id !== id));
    notify('Faculty removed', 'info');
  }

  // Student management
  function addStudent(payload) {
    setStudents((s) => [{ id: `s${Date.now()}`, enrolledEvents: [], bookings: [], equipments: [], xp: 0, ...payload }, ...s]);
    notify('Student added');
  }
  function updateStudent(id, payload) {
    setStudents((s) => s.map(st => st.id === id ? { ...st, ...payload } : st));
    notify('Student updated');
  }
  function deleteStudent(id) {
    setStudents((s) => s.filter(st => st.id !== id));
    notify('Student deleted', 'info');
  }

  // Student search by Student ID
  function searchStudentByStudentId(studentId) {
    const found = students.find(s => s.studentId.toLowerCase() === studentId.trim().toLowerCase());
    if (!found) {
      setSelectedStudent(null);
      notify('Student not found', 'error');
    } else {
      setSelectedStudent(found);
    }
  }

  // Leaderboard computed from students by xp
  const leaderboard = useMemo(() => {
    return [...students].sort((a, b) => b.xp - a.xp).slice(0, 10);
  }, [students]);

  // Simulate live updates for leaderboard if enabled
  useEffect(() => {
    if (!leaderboardLive) return;
    const iv = setInterval(() => {
      // random small xp changes to top students
      setStudents((prev) => prev.map((s, idx) => {
        if (Math.random() > 0.85) return { ...s, xp: s.xp + Math.floor(Math.random() * 40) };
        return s;
      }));
    }, 3000);
    return () => clearInterval(iv);
  }, [leaderboardLive]);

  return (
    <div className="min-h-screen px-6 py-8 bg-slate-50">
      <style>{`\n        @keyframes float-in { 0% { opacity: 0; transform: translateY(14px); } 100% { opacity: 1; transform: translateY(0); } }\n        .animate-float-in { animation: float-in .5s ease-out both; }\n        @keyframes gradient-x { 0% { background-position: 0% } 50% { background-position: 100% } 100% { background-position: 0% } }\n        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 6s ease infinite; }\n        @keyframes pop { from { transform: translateY(12px) scale(.96); opacity: 0 } to { transform: translateY(0) scale(1); opacity: 1 } }\n        .animate-pop { animation: pop .28s cubic-bezier(.16,1,.3,1); }\n        @keyframes blink { 0% { opacity: 1 } 50% { opacity: 0.35 } 100% { opacity: 1 } }\n        .animate-blink { animation: blink 2.2s ease-in-out infinite; }
        @keyframes soft-glow { 0% { box-shadow: 0 0 0 rgba(99,102,241,0); } 50% { box-shadow: 0 6px 24px rgba(99,102,241,0.08); } 100% { box-shadow: 0 0 0 rgba(99,102,241,0); } }
        .animate-soft-glow { animation: soft-glow 4s ease-in-out infinite; }
        .section-card { overflow: hidden; border-radius: 1rem; }
      `}</style>

      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Manage announcements, events, students, faculty and the leaderboard.</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => { setShowAnnModal(true); setEditingAnn(null); }} className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-semibold shadow hover:scale-105 transition">Create Announcement</button>
            <button onClick={() => { setShowEventModal(true); setEditingEvent(null); }} className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:shadow transition">Create Event</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Left: core controls */}
        <section className="space-y-6">
          {/* Summary tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Tile title="Students" value={students.length} gradient="from-emerald-400 to-teal-500" />
            <Tile title="Faculty" value={faculty.length} gradient="from-indigo-400 to-violet-500" />
            <Tile title="Announcements" value={announcements.length} gradient="from-yellow-400 to-orange-400" />
            <Tile title="Events" value={events.length} gradient="from-rose-400 to-pink-500" />
          </div>

          {/* Announcements management */}
          <div className="bg-white p-6 rounded-2xl shadow border animate-float-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Announcements</h2>
              <div className="text-sm text-slate-500">Total: {announcements.length}</div>
            </div>

            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="p-4 rounded-lg border hover:shadow-md transition flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-slate-800">{a.title}</div>
                    <div className="text-sm text-slate-500 mt-1">{a.body}</div>
                    <div className="text-xs text-slate-400 mt-2">{new Date(a.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button onClick={() => { setEditingAnn(a); setShowAnnModal(true); }} className="px-3 py-1 rounded-md text-sm font-semibold bg-indigo-50 text-indigo-700 hover:scale-105 transition">Edit</button>
                    <button onClick={() => deleteAnnouncement(a.id)} className="px-3 py-1 rounded-md text-sm font-semibold bg-rose-50 text-rose-600 hover:scale-105 transition">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events management */}
          <div className="bg-white p-6 rounded-2xl shadow border animate-float-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Events</h2>
              <div className="text-sm text-slate-500">Total: {events.length}</div>
            </div>

            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="p-4 rounded-lg border hover:shadow-md transition flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-slate-800">{ev.title}</div>
                    <div className="text-sm text-slate-500 mt-1">{ev.time} • {ev.place}</div>
                    <div className="text-xs text-slate-400 mt-2">{ev.description}</div>
                    <div className="text-xs text-slate-500 mt-2">Attendees: {ev.attendees?.length || 0}</div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button onClick={() => { setEditingEvent(ev); setShowEventModal(true); }} className="px-3 py-1 rounded-md text-sm font-semibold bg-teal-50 text-teal-700 hover:scale-105 transition">Edit</button>
                    <button onClick={() => deleteEvent(ev.id)} className="px-3 py-1 rounded-md text-sm font-semibold bg-rose-50 text-rose-600 hover:scale-105 transition">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right column: Search, student details, faculty */}
        <aside className="space-y-6 lg:col-span-4">
          {/* Student search */}
          <div className="bg-white p-6 rounded-2xl shadow border animate-float-in">
            <h3 className="text-lg font-bold mb-3">Find Student by ID</h3>
            <div className="flex gap-2">
              <input value={queryStudentId} onChange={(e) => setQueryStudentId(e.target.value)} placeholder="Enter Student ID e.g. 2025CS001" className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              <button onClick={() => searchStudentByStudentId(queryStudentId)} className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:scale-105 transition">Search</button>
            </div>

            {selectedStudent ? (
              <div className="mt-4 p-4 rounded-lg bg-slate-50 border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{selectedStudent.name}</div>
                    <div className="text-sm text-slate-500">{selectedStudent.studentId} • {selectedStudent.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-600">XP</div>
                    <div className="font-extrabold text-xl text-indigo-700">{selectedStudent.xp}</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-sm font-semibold">Enrollments</div>
                  <ul className="mt-2 text-sm text-slate-600 space-y-1">
                    {selectedStudent.enrolledEvents.length === 0 ? <li className="text-slate-400">No enrollments</li> : selectedStudent.enrolledEvents.map(eid => {
                      const ev = events.find(x => x.id === eid);
                      return <li key={eid} className="flex justify-between"><span>{ev?.title || eid}</span><span className="text-xs text-slate-500">{ev?.time}</span></li>;
                    })}
                  </ul>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  <div>
                    <div className="text-sm font-semibold">Bookings</div>
                    <div className="text-sm text-slate-600 mt-1">{selectedStudent.bookings.length === 0 ? '—' : selectedStudent.bookings.map((b,i) => <div key={i}>• {b.title || b.type}</div>)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Equipment</div>
                    <div className="text-sm text-slate-600 mt-1">{selectedStudent.equipments.length === 0 ? '—' : selectedStudent.equipments.map((q,i) => <div key={i}>• {q.name}</div>)}</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={() => { navigator.clipboard?.writeText(selectedStudent.studentId); notify('Student ID copied'); }} className="px-3 py-1 text-sm rounded-lg border">Copy ID</button>
                  <button onClick={() => { setSelectedStudent(null); setQueryStudentId(''); }} className="px-3 py-1 text-sm rounded-lg border">Close</button>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-sm text-slate-500">Search to view detailed student profile.</div>
            )}
          </div>

          {/* Faculty list */}
          <div className="bg-white p-6 rounded-2xl shadow border animate-float-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Faculty</h3>
              <div className="text-sm text-slate-500">Total: {faculty.length}</div>
            </div>
            <ul className="space-y-2">
              {faculty.map(f => (
                <li key={f.id} className="p-3 rounded-lg border hover:shadow-sm transition flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{f.name}</div>
                    <div className="text-xs text-slate-500">{f.dept} • {f.email}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateFaculty(f.id, { name: f.name + ' (Updated)' })} className="px-3 py-1 rounded-md text-sm bg-indigo-50 text-indigo-700">Edit</button>
                    <button onClick={() => deleteFaculty(f.id)} className="px-3 py-1 rounded-md text-sm bg-rose-50 text-rose-600">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* (Leaderboard moved to bottom full-width section) */}
          
        </aside>
      </main>

      {/* Full-width Leaderboard at the bottom for scrolling experience */}
      <section className="w-full bg-gradient-to-b from-white to-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border animate-float-in overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold">Leaderboard — Top Students</h2>
              <div className=" flex flex-col items-center gap-3">
                <label className="text-sm text-slate-600">Live updates</label>
                <button onClick={() => setLeaderboardLive(!leaderboardLive)} className={`px-3 py-1 rounded ${leaderboardLive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{leaderboardLive ? 'On' : 'Off'}</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {leaderboard.map((s, idx) => (
                <div key={s.id} className="p-4 rounded-xl border hover:shadow-lg transition transform hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">{idx+1}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.studentId}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">XP</div>
                      <div className="text-xl font-bold text-indigo-700">{s.xp}</div>
                    </div>
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
              if (editingAnn) updateAnnouncement(editingAnn.id, payload); else createAnnouncement(payload);
              setShowAnnModal(false); setEditingAnn(null);
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
              if (editingEvent) updateEvent(editingEvent.id, payload); else createEvent(payload);
              setShowEventModal(false); setEditingEvent(null);
            }}
          />
        </Modal>
      )}

      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, open: false })} />
    </div>
  );
}

/* ---------- Small UI components used above ---------- */
function Tile({ title, value, gradient }) {
  return (
    <div className={`rounded-2xl p-5 text-white shadow-lg transform hover:-translate-y-1 transition bg-gradient-to-br ${gradient}`}>
      <div className="text-xs font-semibold">{title}</div>
      <div className="text-3xl font-extrabold mt-2">{value}</div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl animate-pop relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
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
      <h3 className="text-2xl font-bold mb-3">{initial ? 'Edit Announcement' : 'Create Announcement'}</h3>
      <div className="space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded" placeholder="Title" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full px-4 py-2 border rounded h-36" placeholder="Message body" />
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2 rounded bg-slate-100">Cancel</button>
        <button onClick={() => onSave({ title, body })} className="px-4 py-2 rounded bg-indigo-600 text-white">Save</button>
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
      <h3 className="text-2xl font-bold mb-3">{initial ? 'Edit Event' : 'Create Event'}</h3>
      <div className="grid grid-cols-1 gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded" placeholder="Event title" />
        <input value={place} onChange={(e) => setPlace(e.target.value)} className="w-full px-4 py-2 border rounded" placeholder="Place" />
        <input value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-4 py-2 border rounded" placeholder="When (e.g. Mar 10 • 9:00 AM)" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded h-28" placeholder="Description" />
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2 rounded bg-slate-100">Cancel</button>
        <button onClick={() => onSave({ title, place, time, description })} className="px-4 py-2 rounded bg-teal-600 text-white">Save</button>
      </div>
    </div>
  );
}