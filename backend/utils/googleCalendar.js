const { google } = require("googleapis");

function getCalendarClient() {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/calendar"]
  );

  return google.calendar({ version: "v3", auth });
}

async function addEventToGoogleCalendar({ title, message, start, end, allDay }) {
  const calendar = getCalendarClient();

  const event = {
    summary: title,
    description: message,
    start: {
      dateTime: allDay ? undefined : start,
      date: allDay ? start.split("T")[0] : undefined,
      timeZone: "Asia/Kolkata"
    },
    end: {
      dateTime: end ? end : start,
      date: allDay ? start.split("T")[0] : undefined,
      timeZone: "Asia/Kolkata"
    }
  };

  const res = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    resource: event
  });

  return res.data;
}

module.exports = { addEventToGoogleCalendar };
