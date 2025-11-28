// src/controllers/gamification.controller.js
import * as gamificationService from "../services/gamification.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Award badge to a user (admin or automated process)
 * body: { userId, badgeTitle }
 */
export const awardBadge = async (req, res) => {
  try {
    const actor = req.user;
    if (!actor) return errorResponse(res, "Unauthorized", 401);

    // Optionally require admin to manually award badge
    if (req.body.manual && actor.role !== "admin") {
      return errorResponse(res, "Forbidden", 403);
    }

    const { userId, badgeTitle } = req.body;
    if (!userId || !badgeTitle) return errorResponse(res, "userId and badgeTitle required", 422);

    const badge = await gamificationService.awardBadge(userId, badgeTitle);
    return successResponse(res, { badge }, "Badge awarded", 201);
  } catch (err) {
    return errorResponse(res, err.message || "Award failed", 500);
  }
};

/**
 * List badges for a user
 */
export const listBadges = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const badges = await gamificationService.listBadgesForUser?.(userId) ?? [];
    return successResponse(res, { badges }, "Badges fetched");
  } catch (err) {
    return errorResponse(res, err.message || "Failed to fetch badges", 500);
  }
};
