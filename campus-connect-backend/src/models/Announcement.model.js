// src/models/Announcement.model.js
import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    audience: {
      type: String,
      enum: ["all", "faculty", "students", "admins"],
      default: "all",
    },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
