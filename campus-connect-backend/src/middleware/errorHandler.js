// src/middleware/errorHandler.js
import logger from '../utils/logger.js';

/**
 * Central error handling middleware for Express.
 * Add this at the end of your middleware stack:
 *   app.use(errorHandler);
 *
 * It supports:
 *  - Errors with `.status` property
 *  - Validation errors with `.details` (Joi or similar)
 */
export default function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  try {
    const status = err.status || err.statusCode || 500;

    // build response payload
    const payload = {
      success: false,
      error: err.message || 'Internal Server Error'
    };

    // include extra details only in non-production or when provided
    if (err.details) payload.details = err.details;
    if (process.env.NODE_ENV !== 'production') {
      payload.stack = err.stack;
    }

    // Log server errors
    if (status >= 500) {
      logger.error('Unhandled server error', {
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
        user: req.user ? req.user._id : undefined
      });
    } else {
      logger.warn('Handled error', {
        message: err.message,
        status,
        path: req.originalUrl,
        method: req.method,
        user: req.user ? req.user._id : undefined
      });
    }

    return res.status(status).json(payload);
  } catch (handlerErr) {
    // fallback
    console.error('Error in errorHandler middleware', handlerErr);
    return res.status(500).json({ success: false, error: 'Critical error' });
  }
}
