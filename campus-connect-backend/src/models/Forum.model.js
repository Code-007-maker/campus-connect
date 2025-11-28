// src/models/Forum.model.js
import mongoose from "mongoose";

const forumPostSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    body: { type: String, required: true },
    replies: [
      {
        repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("ForumPost", forumPostSchema);
