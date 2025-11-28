import React, { useEffect, useState } from "react";
import Toast from "../components/ui/Toast";

const DEMO = [
  { id:"e1", title:"Intro to Astrophysics", start: new Date().toISOString(), end: new Date(Date.now()+3600000).toISOString(), description:"Room 101", registered:false },
  { id:"e2", title:"Robotics Workshop", start: new Date(Date.now()+86400000).toISOString(), end: new Date(Date.now()+90000000).toISOString(), description:"Lab 3", registered:false }
];

export default function Calendar(){
  const [events,setEvents] = useState([]);
  const [selected,setSelected] = useState(null);
  const [toast,setToast] = useState({open:false,message:"",type:""});

  useEffect(()=> setEvents(DEMO),[]);

  const openRegister = (ev) => setSelected(ev);
  const confirmRegister = () => {
    setEvents(prev => prev.map(p => p.id===selected.id ? {...p, registered:true} : p));
    setToast({open:true,message:`Registered for ${selected.title}`,type:"success"});
    setSelected(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-extrabold">Calendar</h1>
      <p className="muted mb-6">Events and class schedules.</p>

      <div className="space-y-4">
        {events.map(e=>(
          <div key={e.id} className="p-4 rounded-lg glass">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{e.title}</div>
                <div className="muted text-sm">{new Date(e.start).toLocaleString()} — {new Date(e.end).toLocaleString()}</div>
                <div className="muted text-xs mt-2">{e.description}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button disabled={e.registered} onClick={()=>openRegister(e)} className={`px-4 py-2 rounded-md ${e.registered ? "bg-gray-200 text-gray-500" : "btn-cta text-white"}`}>{e.registered?"Registered":"Register"}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-[var(--card)] rounded-2xl p-6">
            <h3 className="text-lg font-semibold">Register for {selected.title}</h3>
            <p className="muted mt-2">Confirm your registration (demo).</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={()=>setSelected(null)} className="px-4 py-2 rounded-md border">Cancel</button>
              <button onClick={confirmRegister} className="btn-cta px-4 py-2 rounded-md">Confirm</button>
            </div>
          </div>
        </div>
      )}

      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={()=>setToast({...toast,open:false})} />
    </div>
  );
}
