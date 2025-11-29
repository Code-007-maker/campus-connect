const router = require("express").Router();
const Booking = require("../models/Booking");
const Resource = require("../models/Resource");
const { authMiddleware, requireRole } = require("../middleware/auth");
const { sendMail } = require("../utils/sendMail");

// ----------------------------
// STUDENT: Create booking
// ----------------------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { resourceId, start, end } = req.body;

    const booking = new Booking({
      resource: resourceId,
      student: req.user.id,
      studentEmail: req.user.email,
      start,
      end
    });

    await booking.save();

    await sendMail(
      req.user.email,
      "Booking Request Received",
      `<p>Your booking request was received. Admin will review it.</p>`
    );

    res.json({ message: "Booking submitted", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------
// ADMIN: Get all bookings
// ----------------------------
router.get("/", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const list = await Booking.find()
      .populate("student", "name email")
      .populate("resource");

    res.json({ bookings: list });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------
// ADMIN: Approve booking
// ----------------------------
router.post("/:id/approve", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    booking.status = "approved";
    await booking.save();

    await sendMail(
      booking.studentEmail,
      "Booking Approved",
      `<p>Your booking has been approved!</p>`
    );

    res.json({ message: "Booking Approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------
// ADMIN: Mark as returned
// ----------------------------
router.post("/:id/returned", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    booking.status = "returned";
    booking.fineIssued = false;
    await booking.save();

    res.json({ message: "Marked returned" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
