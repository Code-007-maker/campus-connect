// src/models/Badge.model.js
import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: String,
    description: String,
    criteria: { type: String }, 
  },
  { timestamps: true }
);

export default mongoose.model("Badge", badgeSchema);
