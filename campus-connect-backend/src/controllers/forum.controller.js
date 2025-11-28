// src/controllers/forum.controller.js
import * as forumService from "../services/forum.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Create a forum post (student/faculty/admin)
 * body: { title, body }
 */
export const createPost = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return errorResponse(res, "Unauthorized", 401);

    const payload = {
      createdBy: user._id,
      title: req.body.title || "",
      body: req.body.body
    };

    const post = await forumService.createPost(payload);
    return successResponse(res, { post }, "Post created", 201);
  } catch (err) {
    return errorResponse(res, err.message || "Failed to create post", 500);
  }
};

/**
 * List forum posts
 */
export const listPosts = async (req, res) => {
  try {
    const posts = await forumService.getForumPosts();
    return successResponse(res, { posts }, "Forum posts fetched");
  } catch (err) {
    return errorResponse(res, err.message || "Failed to fetch posts", 500);
  }
};

/**
 * Reply to post
 * body: { message }
 */
export const replyToPost = async (req, res) => {
  try {
    const user = req.user;
    const postId = req.params.id;
    const message = req.body.message;
    if (!message) return errorResponse(res, "Message required", 422);

    // assume forumService.addReply exists
    const updated = await forumService.addReply?.(postId, { repliedBy: user._id, message });
    return successResponse(res, { post: updated }, "Reply added");
  } catch (err) {
    return errorResponse(res, err.message || "Reply failed", 500);
  }
};

/**
 * Delete post (owner or admin)
 */
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = req.user;
    const post = await forumService.getById?.(postId);

    if (post) {
      const isOwner = post.createdBy.toString() === user._id.toString();
      if (!isOwner && user.role !== "admin") return errorResponse(res, "Forbidden", 403);
    } else {
      // proceed (service will return not found)
    }

    await forumService.deletePost?.(postId);
    return successResponse(res, {}, "Post deleted");
  } catch (err) {
    return errorResponse(res, err.message || "Delete failed", 500);
  }
};
