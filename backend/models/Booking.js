const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ⭐ Always store student's email so email never becomes undefined
    studentEmail: {
      type: String,
      required: true
    },

    start: { type: Date, required: true },
    end: { type: Date, required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "returned", "late"],
      default: "pending"
    },

    fineIssued: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
