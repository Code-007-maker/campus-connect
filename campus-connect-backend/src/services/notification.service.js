import Notification from "../models/Notification.model.js";
import { sendPush } from "../integrations/pushNotification.integration.js";

export const sendNotification = async ({ userId, title, message, subscription }) => {
  await Notification.create({ userId, title, message });

  if (subscription) await sendPush(subscription, message);
};
