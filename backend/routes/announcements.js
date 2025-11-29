const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");
const { authMiddleware, requireRole } = require("../middleware/auth");
const { addEventToGoogleCalendar } = require("../utils/googleCalendar");
router.post("/", authMiddleware, requireRole("admin", "faculty"), async (req, res) => {
  try {
    const { title, message, start, end, allDay } = req.body;

    if (!title || !message || !start)
      return res.status(400).json({ message: "Title, message, start date required" });

    const startDate = new Date(start);
    let endDate = end ? new Date(end) : startDate;
    
    // 1️⃣ Save to MongoDB
    const record = await Announcement.create({
      title,
      message,
      start: startDate,
      end: endDate,
      allDay: allDay || false,
      createdBy: req.user.id,
      createdByRole: req.user.role
    });

    // 2️⃣ Add to Google Calendar
    try {
      await addEventToGoogleCalendar({
        title,
        message,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        allDay: allDay || false
      });
    } catch (err) {
      console.error("Google Calendar Error:", err);
    }

    res.status(201).json({
      success: true,
      announcement: record
    });

  } catch (err) {
    console.error("Announcement create error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/", authMiddleware, async (req, res) => {
  try {
    const records = await Announcement.find()
      .sort({ start: 1 })
      .populate("createdBy", "name email role");

    const events = records.map(a => ({
      id: a._id,
      title: a.title,
      start: a.start,
      end: a.end || a.start,
      allDay: a.allDay,
      message: a.message,
      createdBy: a.createdBy?.name,
      createdByRole: a.createdByRole
    }));

    res.json({ success: true, events });
  } catch (err) {
    console.error("Fetch announcement error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
