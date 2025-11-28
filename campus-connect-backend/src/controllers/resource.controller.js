// src/controllers/resource.controller.js
import * as service from "../services/resource.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Create resource (admin)
 */
export const createResource = async (req, res) => {
  try {
    if (req.user.role !== "admin") return errorResponse(res, "Forbidden", 403);

    const payload = {
      name: req.body.name,
      type: req.body.type,
      capacity: req.body.capacity || 0,
      available: req.body.available ?? true,
    };

    const resource = await service.addResource(payload);
    return successResponse(res, { resource }, "Resource created", 201);
  } catch (err) {
    return errorResponse(res, err.message || "Failed to create resource", 400);
  }
};

export const listResources = async (req, res) => {
  try {
    const resources = await service.getResources();
    return successResponse(res, { resources }, "Resources fetched");
  } catch (err) {
    return errorResponse(res, err.message || "Failed to fetch resources", 500);
  }
};

export const updateResource = async (req, res) => {
  try {
    if (req.user.role !== "admin") return errorResponse(res, "Forbidden", 403);

    const updated = await service.updateResource(req.params.id, req.body);
    if (!updated) return errorResponse(res, "Resource not found", 404);
    return successResponse(res, { resource: updated }, "Resource updated");
  } catch (err) {
    return errorResponse(res, err.message || "Update failed", 500);
  }
};

export const deleteResource = async (req, res) => {
  try {
    if (req.user.role !== "admin") return errorResponse(res, "Forbidden", 403);

    await service.deleteResource(req.params.id);
    return successResponse(res, {}, "Resource deleted");
  } catch (err) {
    return errorResponse(res, err.message || "Delete failed", 500);
  }
};
