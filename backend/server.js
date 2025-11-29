require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const announcementRoutes = require("./routes/announcements");
const cron = require("node-cron");
const Booking = require("./models/Booking");
const { sendMail } = require("./utils/sendMail");
const resourceRoutes = require("./routes/resources");
const bookingRoutes = require("./routes/bookings");


cron.schedule("0 * * * *", async () => {
  const now = new Date();

  const overdue = await Booking.find({
    end: { $lt: now },
    status: { $in: ["approved"] },
    fineIssued: false
  });

  for (let b of overdue) {
    b.status = "late";
    b.fineIssued = true;
    await b.save();

    await sendMail(
      b.studentEmail,
      "Late Resource Return",
      `<h2>Your resource booking is overdue!</h2>
       <p>Please return immediately. A fine has been issued.</p>`
    );
  }

  console.log("Cron check completed.");
});


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/announcements", announcementRoutes);

app.use("/api/resources", resourceRoutes);
app.use("/api/bookings", bookingRoutes);
// DB + Server Start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo connected");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connection error", err);
  });
