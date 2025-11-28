// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../models/User.model.js";
import logger from "../utils/logger.js";

export default async function authMiddleware(req, res, next) {
  try {
    let token = null;

    const authHeader = req.headers?.authorization || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1].trim();
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    // VERIFY TOKEN
    let payload;
    try {
      payload = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // FIX: SUPPORT MULTIPLE POSSIBLE FIELDS
    const userId = payload.sub || payload.id || payload._id || payload.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    logger.error("Auth middleware error", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal authentication error",
    });
  }
}
