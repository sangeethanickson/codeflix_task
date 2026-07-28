const Leave = require('../models/Leave');
const { ApiError } = require('../utils/ApiError');

// Fields returned in list views. Note: heavy `auditLogs` are intentionally
// excluded from list responses to keep payloads small.
const LIST_PROJECTION = 'employeeId employeeName leaveType startDate endDate status createdAt';

/**
 * Returns a single page of leave records.
 *
 * Key performance decisions vs. the original `Leave.find()`:
 *  - Server-side pagination (limit/skip) so we never load the whole collection.
 *  - Field projection to drop the large `auditLogs` array from list payloads.
 *  - `.lean()` to skip Mongoose document hydration (plain JS objects).
 *  - Employees are scoped to their own records; only admins see everything.
 *
 * @param {object} opts
 * @param {{userId:string, role:string}} opts.actor  The authenticated caller.
 * @param {number} opts.page
 * @param {number} opts.limit
 * @param {string} [opts.status]
 */
async function listLeaves({ actor, page = 1, limit = 10, status }) {
  const filter = {};
  if (actor.role !== 'Admin') {
    filter.employeeId = actor.userId; // IDOR protection: own records only.
  }
  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  // Run the count and the page query concurrently.
  const [items, total] = await Promise.all([
    Leave.find(filter)
      .select(LIST_PROJECTION)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Leave.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

/**
 * Approves a leave request. Only reachable by admins (enforced by route
 * middleware); records who performed the action in the audit log.
 */
async function approveLeave(leaveId, actor) {
  const updated = await Leave.findByIdAndUpdate(
    leaveId,
    {
      status: 'Approved',
      $push: {
        auditLogs: {
          actionBy: actor.userId,
          notes: 'Leave approved.',
          updatedAt: new Date(),
        },
      },
    },
    { new: true }
  ).lean();

  if (!updated) {
    throw new ApiError(404, 'Leave request not found.');
  }
  return updated;
}

module.exports = { listLeaves, approveLeave };
