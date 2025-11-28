// src/controllers/auth.controller.js
import { registerUser, loginUser } from "../services/auth.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const register = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.email || !payload.password || !payload.name) {
      return errorResponse(res, "name, email and password are required", 422);
    }

    const user = await registerUser(payload);
    // don't return password
    const safeUser = { ...user.toObject() };
    delete safeUser.password;
    return successResponse(res, { user: safeUser }, "Registered successfully", 201);
  } catch (err) {
    return errorResponse(res, err.message || "Registration failed", 400);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return errorResponse(res, "email and password required", 422);

    const { token, user } = await loginUser(email, password);

    const safeUser = { ...user.toObject() };
    delete safeUser.password;

    return successResponse(res, { token, user: safeUser }, "Login successful");
  } catch (err) {
    return errorResponse(res, err.message || "Login failed", 401);
  }
};
