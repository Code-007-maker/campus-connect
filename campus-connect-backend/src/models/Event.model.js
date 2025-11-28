// src/models/Event.model.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    eventType: {
      type: String,
      enum: ["class", "exam", "meeting", "holiday", "activity"],
      default: "class",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    googleEventId: { type: String }, // For calendar sync
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
