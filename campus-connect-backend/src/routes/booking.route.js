// src/routes/booking.routes.js
import express from "express";
import * as bookingController from "../controllers/booking.controller.js";
import  authMiddleware  from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/bookings
 * @desc Create booking
 */
router.post("/", authMiddleware, bookingController.createBooking);

/**
 * @route GET /api/bookings
 * @desc List bookings (admin or own)
 */
router.get("/", authMiddleware, bookingController.listBookings);

/**
 * @route DELETE /api/bookings/:id
 * @desc Cancel booking (owner/admin)
 */
router.delete("/:id", authMiddleware, bookingController.cancelBooking);

export default router;
