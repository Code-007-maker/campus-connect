import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAuth } from "../hooks/useAuth.jsx";

export default function CalendarPage() {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [events, setEvents] = useState([]);

  const loadEvents = async () => {
    const res = await fetch(`${API}/api/announcements`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) {
      // FullCalendar-compatible format
      const formatted = data.events.map(ev => ({
        id: ev.id,
        title: ev.title,
        start: ev.start,
        end: ev.end,
        extendedProps: {
          message: ev.message,
          createdBy: ev.createdBy,
          role: ev.createdByRole
        }
      }));

      setEvents(formatted);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleEventClick = (info) => {
    const ev = info.event.extendedProps;
    alert(
      `Title: ${info.event.title}\n` +
      `When: ${info.event.start}\n` +
      `Description: ${ev.message}\n` +
      `Created By: ${ev.createdBy} (${ev.role})`
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-extrabold mb-4">Campus Calendar</h1>

      <div className="bg-white rounded-xl shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          }}
          height="auto"
          events={events}
          eventClick={handleEventClick}
        />
      </div>
    </div>
  );
}
