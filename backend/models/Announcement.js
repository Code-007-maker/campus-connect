const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },

  // NEW FIELDS FOR CALENDAR
  start: { type: Date, required: true },  // event start datetime (Google Calendar compatible)
  end: { type: Date },                    // optional end time
  allDay: { type: Boolean, default: false },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdByRole: { type: String, enum: ["admin", "faculty"], required: true },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Announcement", announcementSchema);
