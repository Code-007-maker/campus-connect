// src/integrations/pushNotification.integration.js
import axios from "axios";
import { FCM_SERVER_KEY } from "../config/env.js";
import logger from "../utils/logger.js";

// FCM Endpoint
const FCM_URL = "https://fcm.googleapis.com/fcm/send";

/**
 * Sends notification to multiple device tokens via Firebase Cloud Messaging
 * @param {Object} payload
 * title, message, userIds -> used to fetch tokens
 * tokens -> if provided manually
 */
export const sendPushNotification = async ({ title, message, tokens = [] }) => {
  try {
    if (!FCM_SERVER_KEY) {
      logger.warn("⚠ No FCM server key configured. Push notification skipped.");
      return false;
    }

    if (!tokens.length) {
      logger.warn("⚠ No notification tokens provided.");
      return false;
    }

    const body = {
      registration_ids: tokens,
      priority: "high",
      notification: {
        title,
        body: message,
        sound: "default",
      },
      data: {
        title,
        message,
      },
    };

    const headers = {
      Authorization: `key=${FCM_SERVER_KEY}`,
      "Content-Type": "application/json",
    };

    const res = await axios.post(FCM_URL, body, { headers });

    logger.info("Push notification sent:", res.data);
    return true;
  } catch (err) {
    logger.error("FCM Push Error:", err.message);
    return false;
  }
};
