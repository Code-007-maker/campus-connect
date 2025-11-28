// src/routes/calendar.routes.js
import express from "express";
import * as calendarController from "../controllers/calendar.controller.js";
import  authMiddleware  from "../middleware/authMiddleware.js";
import  roleMiddleware  from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/calendar
 * @desc Create event (faculty/admin)
 */
router.post("/", authMiddleware, roleMiddleware(["faculty", "admin"]), calendarController.createEvent);

/**
 * @route GET /api/calendar
 * @desc List events
 */
router.get("/", authMiddleware, calendarController.listEvents);

/**
 * @route DELETE /api/calendar/:id
 * @desc Delete event (owner/admin)
 */
router.delete("/:id", authMiddleware, calendarController.deleteEvent);

export default router;
