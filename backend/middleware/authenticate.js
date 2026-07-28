const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { ApiError } = require('../utils/ApiError');

/**
 * Verifies the Bearer JWT and attaches the decoded identity to req.user.
 *
 * Authorization is ALWAYS derived from this verified token downstream -- never
 * from client-supplied body fields.
 */
function authenticate(req, _res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Authentication required.'));
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = { userId: payload.userId, role: payload.role };
    return next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token.'));
  }
}

module.exports = authenticate;
