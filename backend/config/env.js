require('dotenv').config();

/**
 * Centralized, validated environment configuration.
 *
 * Fails fast on startup if a security-critical variable is missing, so we never
 * boot the server with an unsafe fallback (e.g. a hardcoded JWT secret).
 */
function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === null || value === '') {
    throw new Error(
      `Missing required environment variable "${name}". ` +
        `Copy .env.example to .env and set it before starting the server.`
    );
  }
  return value;
}

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  port: parseInt(process.env.PORT || '5001', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/tr3_hr_db',

  // In production the secret MUST come from the environment. In development we
  // allow a clearly-labelled dev fallback so the app still boots out of the box.
  jwtSecret: isProduction
    ? required('JWT_SECRET')
    : process.env.JWT_SECRET || 'dev_only_insecure_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',

  // Comma-separated list of allowed origins for CORS.
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
};

module.exports = config;
