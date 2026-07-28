const express = require('express');
const authController = require('../controllers/authController');
const { loginRules } = require('../validators/authValidators');
const { validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// POST /api/login
router.post('/login', authLimiter, loginRules, validate, authController.login);

module.exports = router;
