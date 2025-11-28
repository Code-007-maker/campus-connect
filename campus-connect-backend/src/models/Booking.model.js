// src/models/Booking.model.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    resource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource", required: true },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    start: { type: Date, required: true },
    end: { type: Date, required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },

    googleEventId: { type: String }, // calendar sync with resource
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
