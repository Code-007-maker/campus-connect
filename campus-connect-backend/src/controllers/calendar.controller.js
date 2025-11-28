// src/controllers/calendar.controller.js
import * as calendarService from "../services/calendar.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Create calendar event (faculty/admin)
 * body: { title, description, start, end, eventType }
 */
export const createEvent = async (req, res) => {
  try {
    const creator = req.user;
    if (!creator) return errorResponse(res, "Unauthorized", 401);

    const payload = {
      title: req.body.title,
      description: req.body.description || "",
      start: req.body.start,
      end: req.body.end,
      eventType: req.body.eventType || "class",
      createdBy: creator._id,
    };

    const event = await calendarService.createCalendarEvent(payload);
    return successResponse(res, { event }, "Event created", 201);
  } catch (err) {
    return errorResponse(res, err.message || "Failed to create event", 400);
  }
};

/**
 * Delete calendar event (owner/admin)
 */
export const deleteEvent = async (req, res) => {
  try {
    const id = req.params.id;
    // service will check and throw if not allowed
    await calendarService.deleteCalendarEvent(id);
    return successResponse(res, {}, "Event deleted");
  } catch (err) {
    return errorResponse(res, err.message || "Delete failed", 500);
  }
};

/**
 * List events (range optional)
 */
export const listEvents = async (req, res) => {
  try {
    const events = await calendarService.listEvents?.(req.query) ?? []; // optional
    return successResponse(res, { events }, "Events fetched");
  } catch (err) {
    return errorResponse(res, err.message || "Failed to fetch events", 500);
  }
};
