// src/app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import env from './config/env.js';
import authMiddleware from './middleware/authMiddleware.js';
import roleMiddleware from './middleware/roleMiddleware.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
// ...other routes

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: env.SOCKET_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes (example)
app.use('/api/announcements', authMiddleware, announcementRoutes);
// or per-route use roleMiddleware(['admin','faculty']) where needed

// 404
app.use((req, res, next) => res.status(404).json({ success: false, error: 'Not found' }));

// error handler
app.use(errorHandler);

export default app;
