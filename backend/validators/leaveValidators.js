const { body, query, param } = require('express-validator');

const listLeavesRules = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(['Pending', 'Approved', 'Rejected']),
];

const approveLeaveRules = [
  param('id').isMongoId().withMessage('A valid leave id is required.'),
];

const createLeaveRules = [
  body('leaveType').isIn(['Casual', 'Sick', 'Earned']),
  body('startDate').isString().notEmpty(),
  body('endDate').isString().notEmpty(),
  body('reason').optional().isString(),
];

module.exports = { listLeavesRules, approveLeaveRules, createLeaveRules };
