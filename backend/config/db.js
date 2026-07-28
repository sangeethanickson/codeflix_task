const mongoose = require('mongoose');
const config = require('./env');

/**
 * Establishes the MongoDB connection. Kept separate from the Express app so it
 * can be reused by the server bootstrap and the seed script, and so the app
 * wiring stays free of infrastructure concerns.
 */
async function connectDB(uri = config.mongoUri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('HR Database Connected');
  return mongoose.connection;
}

async function disconnectDB() {
  await mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB };
