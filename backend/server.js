const { createApp } = require('./app');
const { connectDB } = require('./config/db');
const config = require('./config/env');

async function start() {
  try {
    await connectDB();

    const app = createApp();
    const server = app.listen(config.port, () =>
      console.log(`HR Backend running on port ${config.port}`)
    );

    // Graceful shutdown.
    const shutdown = (signal) => {
      console.log(`\n${signal} received, shutting down...`);
      server.close(() => process.exit(0));
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
