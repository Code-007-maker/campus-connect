// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from './models/User.model.js'; // make sure model file exists
import logger from '../utils/logger.js';

/**
 * Express middleware to authenticate requests using JWT.
 * - Looks for token in Authorization header "Bearer <token>" or cookie "token"
 * - Verifies token and attaches user document to req.user
 * - If token invalid or user not found => responds 401
 *
 * Usage:
 *   app.use('/api', authMiddleware); // protect all /api routes
 */
export default async function authMiddleware(req, res, next) {
  try {
    // 1) Get token
    let token = null;
    const authHeader = req.headers?.authorization || '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1].trim();
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.query && req.query.token) {
      // optional: accept token in query for websockets or debug
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication token missing'
      });
    }

    // 2) Verify token
    let payload;
    try {
      payload = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      logger.warn('JWT verification failed', { message: err.message });
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // 3) Load user from DB
    const user = await User.findById(payload.sub).select('-passwordHash').lean();
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    // 4) Attach user to request
    req.user = user;
    req.tokenPayload = payload; // sometimes handy
    return next();
  } catch (err) {
    logger.error('Auth middleware error', { message: err.message, stack: err.stack });
    return res.status(500).json({
      success: false,
      error: 'Internal server error in authentication'
    });
  }
}
