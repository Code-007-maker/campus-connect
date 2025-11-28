// src/services/admin.service.js
// Demo admin service using localStorage for persistence.
// Provides CRUD for faculty, students, announcements, events, resources, leaderboard.

const KEY = "campus_admin_v1";

function seed() {
  if (localStorage.getItem(KEY)) return;
  const demo = {
    faculty: [
      { id: "f1", name: "Dr. Asha Menon", email: "asha@svvv.edu", department: "Physics", status: "active" },
      { id: "f2", name: "Prof. R. Gupta", email: "gupta@svvv.edu", department: "CSE", status: "active" }
    ],
    students: [
      { id: "s1", name: "Arjun Kumar", roll: "20BCS001", department: "CSE", year: 2, section: "A", status: "active" },
      { id: "s2", name: "Neha Sharma", roll: "20PHY007", department: "Physics", year: 1, section: "B", status: "active" }
    ],
    announcements: [
      { id: "a1", title: "Library Inventory", type: "Info", audience: "all", body: "Library closed next Friday for inventory.", scheduledFor: null, createdAt: Date.now() - 3600*1000 },
    ],
    events: [
      { id: "e1", title: "Interstellar Talk", type: "Academic", date: "2025-12-09", time: "15:00", venue: "Auditorium", organizer: "Astronomy Dept", description: "Guest lecture on interstellar medium", status: "upcoming" },
      { id: "e2", title: "Hackathon Workshop", type: "Cultural", date: "2025-12-11", time: "11:00", venue: "Lab 3", organizer: "CS Club", description: "Git & Collaborations", status: "upcoming" }
    ],
    resources: [
      { id: "r1", resourceType: "Study Room", name: "Room A101", allocatedTo: null, dueDate: null, status: "available" },
      { id: "r2", resourceType: "Microscope", name: "Microscope X2", allocatedTo: "s1", dueDate: Date.now() + 2*24*3600*1000, status: "issued" }
    ],
    leaderboard: [
      { userId: "s1", name: "Arjun Kumar", score: 1540, rank: 1 },
      { userId: "s2", name: "Neha Sharma", score: 1220, rank: 2 }
    ],
    activities: [
      { id: "act1", userId: "s1", userName: "Arjun Kumar", action: "Submitted assignment", timestamp: Date.now() - 3600*1000 },
      { id: "act2", userId: "s2", userName: "Neha Sharma", action: "Booked Lab seat", timestamp: Date.now() - 7200*1000 }
    ]
  };
  localStorage.setItem(KEY, JSON.stringify(demo));
}

function load() { seed(); return JSON.parse(localStorage.getItem(KEY)); }
function save(obj) { localStorage.setItem(KEY, JSON.stringify(obj)); }

export const adminService = {
  listFaculty() { return Promise.resolve(load().faculty.slice()); },
  createFaculty(payload) {
    const db = load();
    const f = { id: "f"+Date.now(), status: "active", ...payload };
    db.faculty.unshift(f); save(db);
    return Promise.resolve(f);
  },
  updateFaculty(id, payload) {
    const db = load();
    const i = db.faculty.findIndex(x=>x.id===id);
    if(i===-1) return Promise.reject("Not found");
    db.faculty[i] = { ...db.faculty[i], ...payload }; save(db);
    return Promise.resolve(db.faculty[i]);
  },
  deleteFaculty(id) {
    const db = load();
    db.faculty = db.faculty.filter(x=>x.id!==id); save(db);
    return Promise.resolve(true);
  },

  listStudents() { return Promise.resolve(load().students.slice()); },
  createStudent(payload) {
    const db = load();
    const s = { id: "s"+Date.now(), status: "active", ...payload };
    db.students.unshift(s); save(db);
    return Promise.resolve(s);
  },
  updateStudent(id, payload) {
    const db = load();
    const i = db.students.findIndex(x=>x.id===id);
    if(i===-1) return Promise.reject("Not found");
    db.students[i] = { ...db.students[i], ...payload }; save(db);
    return Promise.resolve(db.students[i]);
  },
  deleteStudent(id) {
    const db = load();
    db.students = db.students.filter(x=>x.id!==id); save(db);
    return Promise.resolve(true);
  },

  listAnnouncements() { return Promise.resolve(load().announcements.slice()); },
  createAnnouncement(payload) {
    const db = load();
    const a = { id: "an"+Date.now(), createdAt: Date.now(), ...payload };
    db.announcements.unshift(a); save(db);
    return Promise.resolve(a);
  },
  deleteAnnouncement(id) { const db=load(); db.announcements = db.announcements.filter(x=>x.id!==id); save(db); return Promise.resolve(true); },

  listEvents() { return Promise.resolve(load().events.slice()); },
  createEvent(payload) { const db=load(); const e={id:"ev"+Date.now(),...payload}; db.events.unshift(e); save(db); return Promise.resolve(e); },
  updateEvent(id,payload){ const db=load(); const i=db.events.findIndex(x=>x.id===id); if(i===-1) return Promise.reject("Not found"); db.events[i] = {...db.events[i],...payload}; save(db); return Promise.resolve(db.events[i]); },

  listResources(){ return Promise.resolve(load().resources.slice()); },
  updateResource(id,payload){ const db=load(); const i=db.resources.findIndex(x=>x.id===id); if(i===-1) return Promise.reject("Not found"); db.resources[i] = {...db.resources[i],...payload}; save(db); return Promise.resolve(db.resources[i]); },

  leaderboard() { return Promise.resolve(load().leaderboard.slice()); },
  activities() { return Promise.resolve(load().activities.slice()); },

  // admin metrics quick
  metrics() {
    const db = load();
    return Promise.resolve({
      totalStudents: db.students.length,
      totalFaculty: db.faculty.length,
      activeAnnouncements: db.announcements.length,
      ongoingEvents: db.events.filter(e=>e.status!=="cancelled").length,
      overdueResources: db.resources.filter(r=>r.status==="issued" && r.dueDate && r.dueDate < Date.now()).length
    });
  }
};
