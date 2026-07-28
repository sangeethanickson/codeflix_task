const express = require('express');
const leaveController = require('../controllers/leaveController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { validate } = require('../middleware/validate');
const {
  listLeavesRules,
  approveLeaveRules,
} = require('../validators/leaveValidators');

const router = express.Router();

// All leave routes require a valid token.
router.use(authenticate);

// GET /api/leave/all  -> paginated, scoped to caller (admins see all)
router.get('/all', listLeavesRules, validate, leaveController.listLeaves);

// PUT /api/leave/:id/approve -> admins only
router.put(
  '/:id/approve',
  authorize('Admin'),
  approveLeaveRules,
  validate,
  leaveController.approveLeave
);

module.exports = router;
