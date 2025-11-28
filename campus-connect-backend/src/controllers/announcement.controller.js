// src/controllers/announcement.controller.js
import * as service from "../services/announcement.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Create announcement (faculty/admin)
 */
export const createAnnouncement = async (req, res) => {
  try {
    const creatorId = req.user?._id;
    if (!creatorId) return errorResponse(res, "Unauthorized", 401);

    const payload = {
      title: req.body.title,
      message: req.body.message,
      createdBy: creatorId,
      audience: req.body.audience || "all",
      pinned: !!req.body.pinned,
    };

    const announcement = await service.createAnnouncement(payload);
    return successResponse(res, { announcement }, "Announcement created", 201);
  } catch (err) {
    return errorResponse(res, err.message || "Cannot create announcement", 400);
  }
};

/**
 * List announcements (public for students/faculty/admin)
 */
export const listAnnouncements = async (req, res) => {
  try {
    const announcements = await service.getAnnouncements();
    return successResponse(res, { announcements }, "Announcements fetched");
  } catch (err) {
    return errorResponse(res, err.message || "Failed to fetch announcements", 500);
  }
};

/**
 * Delete announcement (owner or admin)
 */
export const deleteAnnouncement = async (req, res) => {
  try {
    const id = req.params.id;
    const announcement = await service.getById?.(id); // optional helper

    // if service doesn't implement getById, skip ownership check (admins should handle)
    if (announcement) {
      const isOwner = announcement.createdBy?.toString() === req.user._id.toString();
      if (!isOwner && req.user.role !== "admin") {
        return errorResponse(res, "Forbidden", 403);
      }
    }

    await service.deleteAnnouncement(id);
    return successResponse(res, {}, "Announcement deleted");
  } catch (err) {
    return errorResponse(res, err.message || "Delete failed", 500);
  }
};
