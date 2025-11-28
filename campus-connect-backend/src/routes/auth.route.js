// src/routes/auth.routes.js
import express from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register new user
 */
router.post("/register", register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 */
router.post("/login", login);

export default router;
