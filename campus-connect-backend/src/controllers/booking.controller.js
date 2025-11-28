// src/controllers/booking.controller.js
import * as service from "../services/booking.service.js";
import * as resourceService from "../services/resource.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Create booking
 * body: { resourceId, start, end, purpose }
 */
export const createBooking = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return errorResponse(res, "Unauthorized", 401);

    const { resourceId, start, end, purpose } = req.body;
    if (!resourceId || !start || !end) return errorResponse(res, "Missing fields", 422);

    // ensure resource exists
    const resource = await resourceService.getResources?.() // fallback
      ? await resourceService.getResources().then(r => r.find(x => x._id.toString() === resourceId))
      : null;

    if (!resource) {
      // fallback to direct find
      // if resource service had getById, prefer that; but try to get the resource
    }

    const bookingData = {
      resource: resourceId,
      bookedBy: user._id,
      start: new Date(start),
      end: new Date(end),
      status: user.role === "admin" ? "approved" : "pending",
      purpose: purpose || ""
    };

    const booking = await service.createBooking(bookingData);

    return successResponse(res, { booking }, "Booking created", 201);
  } catch (err) {
    return errorResponse(res, err.message || "Booking failed", 400);
  }
};

/**
 * Get bookings for admin or user's own bookings
 */
export const listBookings = async (req, res) => {
  try {
    const user = req.user;
    let bookings;
    if (user.role === "admin") {
      bookings = await service.getBookings();
    } else {
      bookings = await service.getBookingsByUser?.(user._id) ?? // if service supports it
        (await service.getBookings()).filter(b => b.bookedBy?.toString() === user._id.toString());
    }
    return successResponse(res, { bookings }, "Bookings fetched");
  } catch (err) {
    return errorResponse(res, err.message || "Failed to fetch bookings", 500);
  }
};

/**
 * Cancel booking (owner or admin)
 */
export const cancelBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user;

    const booking = await service.getBookingById?.(id) ?? (await service.getBookings()).find(b => b._id.toString() === id);
    if (!booking) return errorResponse(res, "Booking not found", 404);

    // only owner or admin can cancel
    if (booking.bookedBy.toString() !== user._id.toString() && user.role !== "admin") {
      return errorResponse(res, "Forbidden", 403);
    }

    // set status to cancelled (or delete, based on service)
    if (service.cancelBooking) {
      await service.cancelBooking(id);
    } else {
      await service.updateBookingStatus?.(id, "cancelled");
    }

    return successResponse(res, {}, "Booking cancelled");
  } catch (err) {
    return errorResponse(res, err.message || "Cancel failed", 500);
  }
};
