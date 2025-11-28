// src/middleware/roleMiddleware.js
import logger from '../utils/logger.js';

/**
 * Role-based access control middleware factory.
 * Pass an array of allowed roles (strings) to allow access.
 *
 * Example:
 *   router.post('/announcements', authMiddleware, roleMiddleware(['faculty','admin']), controller.create)
 *
 * Supports:
 *  - allowedRoles: ['admin'] or ['faculty','admin'] or []
 *
 * You can also pass 'selfOrRoles' option to allow owner edits (optional)
 */
export default function roleMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      // If no allowedRoles provided, allow any authenticated user
      if (!allowedRoles || allowedRoles.length === 0) {
        return next();
      }

      // user role can be a string or array (support both)
      const userRole = req.user.role;
      const userRoles = Array.isArray(userRole) ? userRole : [userRole];

      const has = userRoles.some((r) => allowedRoles.includes(r));
      if (!has) {
        logger.warn('Access denied: insufficient role', { userId: req.user._id, userRole });
        return res.status(403).json({ success: false, error: 'Forbidden: insufficient privileges' });
      }

      return next();
    } catch (err) {
      logger.error('Role middleware error', { message: err.message, stack: err.stack });
      return res.status(500).json({ success: false, error: 'Server error in role check' });
    }
  };
}
