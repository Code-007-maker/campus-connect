const express = require("express");
const router = express.Router();
const Resource = require("../models/Resource");
const { authMiddleware, requireRole } = require("../middleware/auth");

// Add resource
router.post("/", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const { name, type, description, quantity } = req.body;

    const r = await Resource.create({ name, type, description, quantity });
    res.json({ success: true, resource: r });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// List resources
router.get("/", authMiddleware, async (req, res) => {
  const list = await Resource.find();
  res.json({ success: true, resources: list });
});

module.exports = router;
