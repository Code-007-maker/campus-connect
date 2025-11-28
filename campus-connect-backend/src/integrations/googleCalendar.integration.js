// src/integrations/googleCalendar.integration.js
import { google } from "googleapis";
import {
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_PROJECT_ID,
  GOOGLE_CALENDAR_ID,
} from "../config/env.js";
import logger from "../utils/logger.js";

let calendarClient;

export const getCalendarClient = () => {
  if (calendarClient) return calendarClient;

  const auth = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/calendar"]
  );

  calendarClient = google.calendar({
    version: "v3",
    project: GOOGLE_PROJECT_ID,
    auth,
  });

  logger.info("Google Calendar Connected.");
  return calendarClient;
};

// ---------- Calendar Methods ---------- //

export const createCalendarEvent = async (eventData) => {
  try {
    const calendar = getCalendarClient();

    const res = await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      resource: eventData,
    });

    logger.info("Google Calendar Event Created:", res.data.id);
    return res.data;
  } catch (err) {
    logger.error("Error creating Google Calendar event:", err.message);
    return null;
  }
};

export const updateCalendarEvent = async (eventId, updatedData) => {
  try {
    const calendar = getCalendarClient();

    const res = await calendar.events.patch({
      calendarId: GOOGLE_CALENDAR_ID,
      eventId,
      resource: updatedData,
    });

    logger.info("Google Calendar Event Updated:", res.data.id);
    return res.data;
  } catch (err) {
    logger.error("Error updating Google Calendar event:", err.message);
    return null;
  }
};

export const deleteCalendarEvent = async (eventId) => {
  try {
    const calendar = getCalendarClient();

    await calendar.events.delete({
      calendarId: GOOGLE_CALENDAR_ID,
      eventId,
    });

    logger.info("Calendar event deleted:", eventId);
    return true;
  } catch (err) {
    logger.error("Error deleting Google Calendar event:", err.message);
    return false;
  }
};
