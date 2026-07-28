const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Never selected by default so password hashes don't leak through queries.
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['Employee', 'Admin'], default: 'Employee' },
  },
  { timestamps: true }
);

/**
 * Helper to create a user from a plaintext password, hashing it with bcrypt.
 */
userSchema.statics.createWithPassword = async function createWithPassword(data) {
  const { password, ...rest } = data;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return this.create({ ...rest, passwordHash });
};

/**
 * Constant-time password comparison against the stored bcrypt hash.
 */
userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
