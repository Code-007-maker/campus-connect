// src/routes/forum.routes.js
import express from "express";
import * as forumController from "../controllers/forum.controller.js";
import  authMiddleware  from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/forum
 * @desc Create forum post
 */
router.post("/", authMiddleware, forumController.createPost);

/**
 * @route GET /api/forum
 * @desc List forum posts
 */
router.get("/", authMiddleware, forumController.listPosts);

/**
 * @route POST /api/forum/:id/reply
 * @desc Reply to a forum post
 */
router.post("/:id/reply", authMiddleware, forumController.replyToPost);

/**
 * @route DELETE /api/forum/:id
 * @desc Delete post (owner/admin)
 */
router.delete("/:id", authMiddleware, forumController.deletePost);

export default router;
