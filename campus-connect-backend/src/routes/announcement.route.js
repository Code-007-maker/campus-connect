// src/routes/announcement.routes.js
import express from "express";
import * as announcementController from "../controllers/announcement.controller.js";
import  authMiddleware  from "../middleware/authMiddleware.js";
import  roleMiddleware  from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/announcements
 * @desc Create announcement (faculty/admin)
 */
router.post("/", authMiddleware, roleMiddleware(["faculty", "admin"]), announcementController.createAnnouncement);

/**
 * @route GET /api/announcements
 * @desc List announcements
 */
router.get("/", authMiddleware, announcementController.listAnnouncements);

/**
 * @route DELETE /api/announcements/:id
 * @desc Delete announcement (owner/admin)
 */
router.delete("/:id", authMiddleware, announcementController.deleteAnnouncement);

export default router;
