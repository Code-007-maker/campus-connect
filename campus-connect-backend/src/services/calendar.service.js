import Event from "../models/Event.model.js";
import {
  createCalendarEvent as createGoogleCalendarEvent,
  deleteCalendarEvent as deleteGoogleCalendarEvent,
} from "../integrations/googleCalendar.integration.js";

export const createCalendarEvent = async (data) => {
  // Create event in Google Calendar first
  const googleEvent = await createGoogleCalendarEvent({
    summary: data.title,
    description: data.description,
    start: { dateTime: data.start },
    end: { dateTime: data.end },
  });

  // Store in DB
  const savedEvent = await Event.create({
    ...data,
    googleEventId: googleEvent?.id || null,
  });

  return savedEvent;
};

export const deleteCalendarEvent = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  // Remove from Google Calendar if exists
  if (event.googleEventId) {
    await deleteGoogleCalendarEvent(event.googleEventId);
  }

  await event.deleteOne();

  return { message: "Event deleted" };
};
