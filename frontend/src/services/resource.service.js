const KEY = "campus_resources_v1";
const DEFAULT = [
  { _id: "r1", name: "Study Room A", location: "Library 2nd Floor", type: "Room", available: true, capacity: 6, description: "Quiet room w/board." },
  { _id: "r2", name: "3D Printer (Ultimaker)", location: "Makerspace", type: "Equipment", available: true, capacity:1, description: "High-res 3D printer." },
  { _id: "r3", name: "CS Lab GPU", location: "Bldg C Lab 4", type: "Lab", available: true, capacity:30, description: "CUDA-enabled stations." },
];

export const resourceService = {
  async list(){
    const raw = localStorage.getItem(KEY);
    if(!raw){ localStorage.setItem(KEY, JSON.stringify(DEFAULT)); return DEFAULT; }
    return JSON.parse(raw);
  },
  async book(id, booking){
    const raw = localStorage.getItem(KEY) || "[]";
    const arr = JSON.parse(raw);
    const i = arr.findIndex(r=>r._id===id);
    if(i>=0){ arr[i].available = false; arr[i].booking = booking; localStorage.setItem(KEY, JSON.stringify(arr)); return arr[i]; }
    throw new Error("not found");
  }
};
