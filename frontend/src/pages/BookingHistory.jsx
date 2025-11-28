// src/pages/BookingHistory.jsx
import React, { useEffect, useState } from "react";
import { bookingService } from "../services/booking.service";
import { formatDate } from "../utils/formatDate";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    bookingService.userBookings().then((res) => setBookings(res || [])).catch(() => {
      // demo fallback
      setBookings([
        { _id: "b1", resourceName: "Study Room A", from: new Date().toISOString(), to: new Date(Date.now() + 3600e3).toISOString(), status: "confirmed" },
      ]);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-extrabold mb-4">My Bookings</h1>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="p-6 rounded-lg bg-white/30 border border-white/30">No bookings found.</div>
        ) : (
          bookings.map((b) => (
            <div key={b._id} className="bg-white/80 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{b.resourceName || b.resource?.name}</div>
                  <div className="text-sm text-gray-600">{formatDate(b.from)} - {formatDate(b.to)}</div>
                </div>
                <div className="text-sm font-semibold">
                  <span className={b.status === "confirmed" ? "text-green-700" : "text-gray-700"}>{b.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
