const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  // If already connected, reuse existing connection (crucial for Serverless lambdas)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const mongoUri = process.env.MONGO_URI;
    
    // First try standard connection (MongoDB Atlas / External)
    if (mongoUri && !mongoUri.includes('localhost:27017')) {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Connected to Atlas / External DB: ${conn.connection.host}`);
      return;
    }

    // Try local Mongo URI if provided
    try {
      const conn = await mongoose.connect(mongoUri || 'mongodb://127.0.0.1:27017/eduvibe_elearning', {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`✅ MongoDB Connected to Local Instance: ${conn.connection.host}`);
      return;
    } catch (localErr) {
      console.log('ℹ️  No local MongoDB daemon detected. Checking for in-memory fallback...');
    }

    // Fallback to in-memory MongoDB in local dev environment
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create({
        instance: {
          dbName: 'eduvibe_elearning',
        },
      });
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ Embedded MongoDB In-Memory Server Connected: ${conn.connection.host}`);
      console.log(`ℹ️  Data is running in-memory and auto-seeded.`);
    } catch (memErr) {
      console.warn('ℹ️ Running in cloud environment without MongoDB URI. Please set MONGO_URI in your Vercel Environment Variables.');
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
