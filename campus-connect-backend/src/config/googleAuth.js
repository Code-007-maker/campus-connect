// src/config/googleAuth.js
import { google } from "googleapis";
import env from "./env.js";

const jwtClient = new google.auth.JWT(
  env.GOOGLE_CLIENT_EMAIL,
  null,
  env.GOOGLE_PRIVATE_KEY,
  ["https://www.googleapis.com/auth/calendar"]
);

const calendar = google.calendar({
  version: "v3",
  auth: jwtClient
});

export const ensureGoogleAuth = async () => {
  try {
    await jwtClient.authorize();
    return jwtClient;
  } catch (err) {
    console.error("❌ Google Auth Failed:", err.message);
    throw err;
  }
};

export { calendar };
