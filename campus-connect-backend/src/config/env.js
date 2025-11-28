import dotenv from "dotenv";
dotenv.config();

export const {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  NODE_ENV,
  REDIS_URL,

  // Google Calendar
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_PROJECT_ID,
  GOOGLE_CALENDAR_ID,

  // Push Notifications
  FCM_SERVER_KEY,

  // Optional
  CLOUDINARY_URL,
  SENDGRID_API_KEY
} = process.env;

// Missing constant added ↓
export const SOCKET_ORIGIN = process.env.SOCKET_ORIGIN || "*";

// Default export structure
export default {
  PORT: PORT || 5000,
  MONGO_URI,
  JWT_SECRET,
  NODE_ENV,
  REDIS_URL,
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_PROJECT_ID,
  GOOGLE_CALENDAR_ID,
  FCM_SERVER_KEY,
  CLOUDINARY_URL,
  SENDGRID_API_KEY,
  SOCKET_ORIGIN,
};
