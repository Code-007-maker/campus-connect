// src/models/Resource.model.js
import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["room", "lab", "equipment", "library"],
      required: true,
    },
    capacity: Number,
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);
