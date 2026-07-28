const { body } = require('express-validator');

const loginRules = [
  body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password').isString().isLength({ min: 1 }).withMessage('Password is required.'),
];

module.exports = { loginRules };
