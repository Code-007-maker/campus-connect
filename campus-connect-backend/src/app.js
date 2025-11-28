// app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

// ROUTES
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import announcementRoutes from "./routes/announcement.route.js";
import calendarRoutes from "./routes/calendar.route.js";
import resourceRoutes from "./routes/resource.route.js";
import bookingRoutes from "./routes/booking.route.js";
import notificationRoutes from "./routes/notification.route.js";
import forumRoutes from "./routes/forum.route.js";

// Swagger Docs
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";

const __dirname = path.resolve();
const swaggerPath = path.join(__dirname, "./docs/swagger.json");

const swaggerDocument = JSON.parse(
  fs.readFileSync(swaggerPath, "utf-8")
);

const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.SOCKET_ORIGIN || "*",
    credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// API DOCS
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ROUTES USE
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/forum", forumRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
    res.json({
        status: "OK",
        message: "Campus Management API Running 🚀"
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

export default app;
