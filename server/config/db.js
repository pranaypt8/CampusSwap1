const mongoose = require('mongoose');

const isProduction = process.env.NODE_ENV === 'production';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Atlas] Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[MongoDB Atlas Error] ${error.message}`);

    if (isProduction) {
      // In production we never want to silently fall back to a throwaway
      // in-memory database with fake seed data - that would look like the
      // app is working while real user data has nowhere permanent to go.
      // Fail loudly so the host (Render/Railway/etc.) reports the deploy
      // as unhealthy instead of masking the problem.
      console.error(
        '[MongoDB] Could not connect to the database in production. ' +
        'Check that MONGODB_URI is set correctly and that this server\'s ' +
        'outbound IP is allowed in your MongoDB Atlas Network Access list.'
      );
      process.exit(1);
    }

    // Development-only convenience fallback so you can work on the UI
    // without a live Atlas connection.
    try {
      console.log('[MongoDB Fallback] Dev mode - starting in-memory Mongo server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();

      await mongoose.connect(uri);
      console.log(`[MongoDB In-Memory] Connected to fallback DB: ${uri}`);

      const seedDB = require('../utils/seedData');
      await seedDB();
      console.log('[MongoDB In-Memory] Demo listings and users seeded successfully!');
      return false;
    } catch (memError) {
      console.error('[MongoDB Fallback Error]', memError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
