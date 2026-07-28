const { connectDB, disconnectDB } = require('./config/db');
const Leave = require('./models/Leave');
const User = require('./models/User');

/**
 * Seeds demo users and 5,000 leave requests.
 *
 * The leave records are distributed across the seeded employees so that the
 * per-user (employee-scoped) views return realistic data.
 */
const seedData = async () => {
  try {
    await connectDB();

    await Promise.all([Leave.deleteMany({}), User.deleteMany({})]);
    console.log('Old users and leave requests cleared...');

    // --- Users ---
    const admin = await User.createWithPassword({
      employeeId: 'ADMIN_001',
      name: 'HR Admin',
      email: 'admin@codeflix.test',
      password: 'Admin@123',
      role: 'Admin',
    });

    const employee = await User.createWithPassword({
      employeeId: 'EMP_1001',
      name: 'Employee 1',
      email: 'employee@codeflix.test',
      password: 'Employee@123',
      role: 'Employee',
    });

    console.log(
      `Seeded users:\n  Admin    -> ${admin.email} / Admin@123\n  Employee -> ${employee.email} / Employee@123`
    );

    // --- Leave requests ---
    const types = ['Casual', 'Sick', 'Earned'];
    const statuses = ['Pending', 'Approved', 'Rejected'];
    const leaves = [];

    for (let i = 1; i <= 5000; i++) {
      const empNum = i % 100;
      // Ensure a solid chunk of records belong to the demo employee so their
      // scoped dashboard isn't empty.
      const employeeId = i % 5 === 0 ? 'EMP_1001' : `EMP_${1000 + empNum}`;

      leaves.push({
        employeeId,
        employeeName: employeeId === 'EMP_1001' ? 'Employee 1' : `Employee ${empNum}`,
        leaveType: types[i % 3],
        startDate: '2026-08-01',
        endDate: '2026-08-03',
        reason: `Personal reasons for request #${i}`,
        status: statuses[i % 3],
        // Build a fresh object per entry (no shared reference).
        auditLogs: Array.from({ length: 5 }, () => ({
          actionBy: 'System Admin',
          notes: 'Standard log entry for verification and auditing.',
        })),
      });
    }

    await Leave.insertMany(leaves);
    console.log('Successfully seeded 5,000 leave requests!');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
};

seedData();
