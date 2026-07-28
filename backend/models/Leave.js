const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    updatedAt: { type: Date, default: Date.now },
    actionBy: String,
    notes: String,
  },
  { _id: false }
);

const leaveSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    leaveType: { type: String, enum: ['Casual', 'Sick', 'Earned'], required: true },
    startDate: String,
    endDate: String,
    reason: String,
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    auditLogs: [auditLogSchema],
  },
  { timestamps: true }
);

// Indexes to support the common access patterns: filtering by employee, by
// status, and listing newest-first (used by keyset/paginated queries).
leaveSchema.index({ employeeId: 1 });
leaveSchema.index({ status: 1 });
leaveSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Leave', leaveSchema);
