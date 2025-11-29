const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    name: String,
    type: { type: String, enum: ["Room", "Lab", "Equipment"] },
    description: String,
    location: String,
    capacity: Number,
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
