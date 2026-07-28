const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  leaveType: { type: String, enum: ['Casual', 'Sick', 'Earned'], required: true },
  startDate: String,
  endDate: String,
  reason: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  
  auditLogs: [{
    updatedAt: { type: Date, default: Date.now },
    actionBy: String,
    notes: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);