// src/controllers/user.controller.js
import * as userService from "../services/user.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Admin: list users
 */
export const listUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return successResponse(res, { users }, "Users fetched");
  } catch (err) {
    return errorResponse(res, err.message || "Failed to fetch users", 500);
  }
};

/**
 * Get profile for current user
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return errorResponse(res, "Unauthorized", 401);

    const user = await userService.getUserById(userId);
    if (!user) return errorResponse(res, "User not found", 404);

    const safeUser = user.toObject();
    delete safeUser.password;
    return successResponse(res, { user: safeUser }, "Profile loaded");
  } catch (err) {
    return errorResponse(res, err.message || "Failed to load profile", 500);
  }
};

/**
 * Update user (admin or owner)
 */
export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const requester = req.user;

    // allow if requester is admin or updating own profile
    if (requester.role !== "admin" && requester._id.toString() !== id) {
      return errorResponse(res, "Forbidden", 403);
    }

    const updated = await userService.updateUser(id, req.body);
    if (!updated) return errorResponse(res, "User not found", 404);

    const safe = updated.toObject();
    delete safe.password;
    return successResponse(res, { user: safe }, "User updated");
  } catch (err) {
    return errorResponse(res, err.message || "Update failed", 500);
  }
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.user.role !== "admin") return errorResponse(res, "Forbidden", 403);

    await userService.deleteUser(id);
    return successResponse(res, {}, "User deleted");
  } catch (err) {
    return errorResponse(res, err.message || "Delete failed", 500);
  }
};
