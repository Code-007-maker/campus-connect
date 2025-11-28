// src/services/project.service.js
// Mock project matchmaking service — uses localStorage + event bus

const KEY = "campus_projects_v1";

function seed(){
  if (!localStorage.getItem(KEY)){
    const starter = [
      {
        id: "p1",
        title: "AI Attendance System",
        description: "Build a facial-recognition based attendance system.",
        skills: ["AI", "ML", "Python"],
        owner: "student123",
        members: ["student123"],
        createdAt: Date.now() - 86400000
      },
      {
        id: "p2",
        title: "Planetary Orbit Simulator",
        description: "3D Web-based orbital mechanics simulation.",
        skills: ["Astrophysics", "WebGL", "Three.js"],
        owner: "profA",
        members: ["profA"],
        createdAt: Date.now() - 3600000
      }
    ];
    localStorage.setItem(KEY, JSON.stringify(starter));
  }
}

function read(){
  seed();
  return JSON.parse(localStorage.getItem(KEY));
}

function write(d){
  localStorage.setItem(KEY, JSON.stringify(d));
}

export const projectService = {
  async list(){
    await new Promise(r=>setTimeout(r,100));
    return read();
  },

  async create({ title, description, skills, owner }){
    const arr = read();
    const p = {
      id: "p"+Date.now(),
      title,
      description,
      skills,
      owner,
      members: [owner],
      createdAt: Date.now()
    };
    arr.unshift(p);
    write(arr);
    if (window.__campus_bus)
      window.__campus_bus.dispatchEvent(new CustomEvent("project:created", { detail: p }));
    return p;
  },

  async join(projectId, user){
    const arr = read();
    const p = arr.find(p=>p.id===projectId);
    if (!p) throw new Error("Project not found");
    if (!p.members.includes(user)) p.members.push(user);
    write(arr);
    if (window.__campus_bus)
      window.__campus_bus.dispatchEvent(new CustomEvent("project:joined", { detail: { projectId, user } }));
    return p;
  },

  async recommendUsers(skills=[]){
    // mock recommended user profiles
    const candidates = [
      { name:"Ananya", skills:["ML","Python","React"], xp:240 },
      { name:"Rohit", skills:["Astrophysics","C++","Simulations"], xp:500 },
      { name:"Meera", skills:["UI/UX","Tailwind","Design"], xp:150 },
      { name:"Kabir", skills:["Backend","NodeJS","Databases"], xp:320 },
    ];

    // loose matching
    if (skills.length === 0) return candidates;

    return candidates.filter(c =>
      c.skills.some(s => skills.includes(s))
    );
  }
};
