import Notification from "../models/Notification.model.js";
import { sendPushNotification } from "../integrations/pushNotification.integration.js";

export const sendNotification = async ({ userId, title, message, subscription }) => {
  await Notification.create({ userId, title, message });

  if (subscription) await sendPushNotification(subscription, message);
};
