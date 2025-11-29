import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth.jsx";

export default function AnnouncementsAdmin() {
  const { token, user } = useAuth();
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [allDay, setAllDay] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const create = async () => {
    if (!title.trim() || !body.trim() || !start.trim()) {
      setMsg("Please fill title, body and start date");
      return;
    }

    setLoading(true);
    setMsg("");

    const res = await fetch(`${API}/api/announcements`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        message: body,
        start,
        end: end || null,
        allDay,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMsg(data.message || "Error creating announcement");
      return;
    }

    setMsg("Announcement published & added to Google Calendar 🎉");

    // Reset form
    setTitle("");
    setBody("");
    setStart("");
    setEnd("");
    setAllDay(false);
  };

  // faculty/admin only allowed
  if (!["admin", "faculty"].includes(user?.role)) {
    return (
      <div className="text-center py-10 text-slate-600">
        You do not have permission to publish announcements.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-4">Create Announcement</h1>

      <div
        className="bg-white rounded-2xl p-6 shadow border"
        style={{ borderColor: "var(--glass-border)" }}
      >

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
          />
        </div>

        {/* Body */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full rounded-lg border px-3 py-2 min-h-[120px]"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Event details"
          />
        </div>

        {/* Start Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Start Date & Time</label>
          <input
            type="datetime-local"
            className="w-full rounded-lg border px-3 py-2"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            End Date & Time (optional)
          </label>
          <input
            type="datetime-local"
            className="w-full rounded-lg border px-3 py-2"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>

        {/* All-day */}
        <div className="mb-4 flex gap-2 items-center">
          <input
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
          />
          <label className="text-sm">All-day event</label>
        </div>

        {/* Status Message */}
        {msg && (
          <div
            className={`mb-3 text-sm ${
              msg.includes("success") || msg.includes("🎉")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {msg}
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            onClick={create}
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish"}
          </button>

          <button
            className="px-4 py-2 border rounded-lg"
            onClick={() => {
              setTitle("");
              setBody("");
              setStart("");
              setEnd("");
              setAllDay(false);
              setMsg("");
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
