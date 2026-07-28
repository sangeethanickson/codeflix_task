const leaveService = require('../services/leaveService');
const { asyncHandler } = require('../utils/asyncHandler');

const listLeaves = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const status = req.query.status;

  const result = await leaveService.listLeaves({
    actor: req.user,
    page,
    limit,
    status,
  });

  res.json(result);
});

const approveLeave = asyncHandler(async (req, res) => {
  const updatedLeave = await leaveService.approveLeave(req.params.id, req.user);
  res.json({ message: 'Leave request approved successfully', updatedLeave });
});

module.exports = { listLeaves, approveLeave };
