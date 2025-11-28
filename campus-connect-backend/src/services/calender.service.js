import Event from "../models/Event.model.js";
import { createGoogleEvent, deleteGoogleEvent } from "../integrations/googleCalendar.integration.js";

export const createCalendarEvent = async (data) => {
  const googleEvent = await createGoogleEvent(data);

  const savedEvent = await Event.create({
    ...data,
    googleEventId: googleEvent.id,
  });

  return savedEvent;
};

export const deleteCalendarEvent = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  await deleteGoogleEvent(event.googleEventId);
  await event.deleteOne();

  return { message: "Event deleted" };
};
