// src/controllers/notification.controller.js
import * as notificationService from "../services/notification.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Send notification (admin/faculty)
 * body: { userId, title, message, subscription }
 */
export const sendNotification = async (req, res) => {
  try {
    const sender = req.user;
    if (!sender) return errorResponse(res, "Unauthorized", 401);

    // only faculty/admin allowed to send campus-wide notifications
    if (!["faculty", "admin"].includes(sender.role)) {
      return errorResponse(res, "Forbidden", 403);
    }

    const { userId, title, message, subscription } = req.body;
    await notificationService.sendNotification({ userId, title, message, subscription, senderId: sender._id });

    return successResponse(res, {}, "Notification sent");
  } catch (err) {
    return errorResponse(res, err.message || "Failed to send notification", 500);
  }
};

/**
 * List notifications for current user
 */
export const listNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const items = await notificationService.getNotificationsForUser?.(userId) ?? [];
    return successResponse(res, { items }, "Notifications fetched");
  } catch (err) {
    return errorResponse(res, err.message || "Failed to fetch notifications", 500);
  }
};
