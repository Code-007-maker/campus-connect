const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const { authMiddleware} = require('../middleware/auth');
const { sendTeacherInvite } = require('../utils/mailer');
const { requireRole } = require("../middleware/auth");
const Booking = require("../models/Booking");


const router = express.Router();
const SALT_ROUNDS = 10;

router.get(
  "/bookings",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const bookings = await Booking.find({})
        .populate("student", "name email")
        .populate("resource", "name type");

      return res.json({ bookings });
    } catch (err) {
      console.error("Bookings fetch error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

// Admin-only route to create a faculty/teacher by email and send auto-generated password
router.post('/add-teacher', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    // create random password
    const plainPassword = crypto.randomBytes(6).toString('base64').replace(/\W/g, 'A').slice(0, 10); // ~10 chars sanitized
    const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);

    const newUser = new User({
      name: name || 'Instructor',
      email: email.toLowerCase(),
      password: hashed,
      role: 'faculty',
      createdBy: req.user.id
    });

    await newUser.save();

    // send email
    try {
      await sendTeacherInvite(email, plainPassword, name);
    } catch (mailErr) {
      console.error('Mail error', mailErr);
      // optionally delete user if mail failed (or keep and provide another flow)
      return res.status(500).json({ message: 'User created but failed to send email' });
    }

    return res.status(201).json({ message: 'Teacher created and invitation sent', user: { id: newUser._id, email: newUser.email, role: newUser.role }});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE student (admin only)
router.delete(
  "/students/:id",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const student = await User.findOne({
        _id: req.params.id,
        role: "student"
      });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      await student.deleteOne();

      return res.json({ message: "Student deleted successfully" });
    } catch (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /api/admin/teachers
// Get list of all faculty members (teachers)
router.get('/teachers', authMiddleware, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1"));
    const limit = Math.min(50, parseInt(req.query.limit || "20"));
    const search = (req.query.q || "").trim();

    const filter = { role: "faculty" };

    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await User.countDocuments(filter);

    const teachers = await User.find(filter)
      .select("-password") // Never send password
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      total,
      page,
      limit,
      teachers
    });

  } catch (err) {
    console.error("Teacher list error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/students
router.get('/students', authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, students });
  } catch (err) {
    console.error("Student list error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/bookings/approve/:id",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ message: "Not found" });

      booking.status = "approved";
      await booking.save();

      await Resource.findByIdAndUpdate(booking.resource, { available: false });

      return res.json({ message: "Booking approved" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.post(
  "/bookings/reject/:id",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ message: "Not found" });

      booking.status = "rejected";
      await booking.save();

      return res.json({ message: "Booking rejected" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


router.post("/bookings/approve/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("student").populate("resource");

    booking.status = "approved";
    await booking.save();

    // 📧 Send email
    await sendMail(
      booking.student.email,
      "Your Booking Has Been Approved ✔",
      `
        <h2>Booking Approved!</h2>
        <p>Hello <b>${booking.student.name}</b>,</p>
        <p>Your booking for <b>${booking.resource.name}</b> has been approved.</p>
        <p><b>Start:</b> ${new Date(booking.start).toLocaleString()}<br/>
        <b>End:</b> ${new Date(booking.end).toLocaleString()}</p>
        <br/>Thank you,<br/>Campus Connect System
      `
    );

    res.json({ message: "Approved and email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
