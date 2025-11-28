// src/routes/notification.routes.js
import express from "express";
import * as notificationController from "../controllers/notification.controller.js";
import  authMiddleware  from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/notifications
 * @desc Send notification (faculty/admin)
 */
router.post("/", authMiddleware, notificationController.sendNotification);

/**
 * @route GET /api/notifications
 * @desc List notifications for current user
 */
router.get("/", authMiddleware, notificationController.listNotifications);

export default router;
