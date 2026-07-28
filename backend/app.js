const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const config = require('./config/env');
const routes = require('./routes');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorHandler');

/**
 * Builds and configures the Express application. Kept free of side effects
 * (no DB connect, no listen) so it can be imported in tests.
 */
function createApp() {
  const app = express();

  // Security headers.
  app.use(helmet());

  // Restrict CORS to configured origins instead of allowing everyone.
  app.use(
    cors({
      origin: config.corsOrigins,
      credentials: true,
    })
  );

  app.use(express.json({ limit: '1mb' }));

  // Baseline rate limiting across the API.
  app.use('/api', apiLimiter);

  app.use('/api', routes);

  // 404 + centralized error handling (must be last).
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
