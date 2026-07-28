const mongoose = require('mongoose');
const Leave = require('./models/Leave');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tr3_hr_db';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await Leave.deleteMany({});
    console.log('Old leave requests cleared...');

    const types = ['Casual', 'Sick', 'Earned'];
    const statuses = ['Pending', 'Approved', 'Rejected'];
    const leaves = [];

    for (let i = 1; i <= 5000; i++) {
      leaves.push({
        employeeId: `EMP_${1000 + (i % 100)}`,
        employeeName: `Employee ${i % 100}`,
        leaveType: types[i % 3],
        startDate: '2026-08-01',
        endDate: '2026-08-03',
        reason: `Personal reasons for request #${i}`,
        status: statuses[i % 3],
        auditLogs: Array(5).fill({
          actionBy: 'System Admin',
          notes: 'Standard log entry for verification and auditing.'
        })
      });
    }

    await Leave.insertMany(leaves);
    console.log('Successfully seeded 5,000 leave requests!');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();