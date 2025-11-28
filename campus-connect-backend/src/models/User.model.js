// src/models/User.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // encrypted
    avatar: { type: String },
    department: { type: String },
    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
      default: "student",
    },
    language: { type: String, default: "en" },

    // Gamification:
    badges: [
      {
        badgeId: { type: mongoose.Schema.Types.ObjectId, ref: "Badge" },
        earnedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
