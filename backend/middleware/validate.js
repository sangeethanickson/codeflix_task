const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/ApiError');

/**
 * Runs express-validator chains and short-circuits with a 400 + field details
 * when validation fails. Keeps controllers free of validation boilerplate.
 */
function validate(req, _res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const details = result.array().map((e) => ({ field: e.path, message: e.msg }));
    return next(new ApiError(400, 'Validation failed.', details));
  }
  return next();
}

module.exports = { validate };
