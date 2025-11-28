// src/routes/resource.routes.js
import express from "express";
import * as resourceController from "../controllers/resource.controller.js";
import  authMiddleware  from "../middleware/authMiddleware.js";
import  roleMiddleware  from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/resources
 * @desc Create resource (admin only)
 */
router.post("/", authMiddleware, roleMiddleware("admin"), resourceController.createResource);

/**
 * @route GET /api/resources
 * @desc List resources
 */
router.get("/", authMiddleware, resourceController.listResources);

/**
 * @route PUT /api/resources/:id
 * @desc Update resource (admin only)
 */
router.put("/:id", authMiddleware, roleMiddleware("admin"), resourceController.updateResource);

/**
 * @route DELETE /api/resources/:id
 * @desc Delete resource (admin only)
 */
router.delete("/:id", authMiddleware, roleMiddleware("admin"), resourceController.deleteResource);

export default router;
