// src/routes/user.routes.js
import express from "express";
import * as userController from "../controllers/user.controller.js";
import  authMiddleware  from "../middleware/authMiddleware.js";
import  roleMiddleware  from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * @route GET /api/users
 * @desc Admin: List all users
 */
router.get("/", authMiddleware, roleMiddleware("admin"), userController.listUsers);

/**
 * @route GET /api/users/me
 * @desc Get current user profile
 */
router.get("/me", authMiddleware, userController.getProfile);

/**
 * @route PUT /api/users/:id
 * @desc Update user (admin or self)
 */
router.put("/:id", authMiddleware, userController.updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user (admin only)
 */
router.delete("/:id", authMiddleware, roleMiddleware("admin"), userController.deleteUser);

export default router;
