const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const { ApiError } = require('../utils/ApiError');

/**
 * Authenticates a user by email + password and returns a signed JWT plus a
 * safe (hash-free) user object.
 *
 * The role is read from the persisted user record and embedded in the token, so
 * downstream authorization can trust it without re-querying the DB.
 */
async function login(email, password) {
  // passwordHash has `select: false`, so explicitly request it here only.
  const user = await User.findOne({ email }).select('+passwordHash');

  // Verify even when the user is missing? We still return a generic error to
  // avoid leaking which emails exist (user enumeration).
  const passwordOk = user ? await user.verifyPassword(password) : false;
  if (!user || !passwordOk) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = jwt.sign(
    { userId: user.employeeId, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return {
    token,
    user: {
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = { login };
