const { ApiError } = require('../utils/ApiError');

/**
 * Role-based access control. Must run after `authenticate`, which populates
 * req.user from the verified token.
 *
 * Usage: router.put('/approve', authenticate, authorize('Admin'), handler)
 */
function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }
    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'Access denied. Insufficient permissions.'));
    }
    return next();
  };
}

module.exports = authorize;
