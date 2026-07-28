const config = require('../config/env');
const { ApiError } = require('../utils/ApiError');

/**
 * 404 handler for unmatched routes.
 */
function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Centralized error handler. Guarantees a consistent JSON shape and, crucially,
 * never leaks internal error messages / stack traces to clients in production.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Translate common Mongoose errors into safe, meaningful responses.
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed.';
  }

  if (statusCode >= 500) {
    console.error('[ERROR]', err);
  }

  const body = { message };
  if (err.details) body.details = err.details;
  if (!config.isProduction && statusCode >= 500) body.stack = err.stack;

  res.status(statusCode).json(body);
}

module.exports = { notFound, errorHandler };
