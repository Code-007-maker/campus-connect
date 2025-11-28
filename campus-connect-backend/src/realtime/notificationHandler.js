// src/realtime/notificationHandler.js
import { broadcastMessage } from "./socketManager.js";
import { sendPushNotification } from "../integrations/pushNotification.integration.js";

/**
 * Handles a notification event
 * @param {Object} data - Notification payload
 * @example
 * {
 *   type: "notification",
 *   title: "New Event",
 *   message: "Exam schedule updated",
 *   userIds: ["userId1", "userId2"]
 * }
 */
export const handleNotification = async (data) => {
  try {
    const { title, message, userIds } = data;

    // Broadcast to all connected clients via WebSocket
    broadcastMessage({ type: "notification", title, message });

    // Optional: send push notification via FCM / OneSignal
    if (userIds && userIds.length > 0) {
      await sendPushNotification({ title, message, userIds });
    }

    console.log("Notification handled successfully:", title);
  } catch (err) {
    console.error("Error handling notification:", err);
  }
};
