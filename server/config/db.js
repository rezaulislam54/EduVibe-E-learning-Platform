const mongoose = require('mongoose');

let mongod = null;

// Disable long buffering timeouts so fallback triggers instantly
mongoose.set('bufferTimeoutMS', 2000);

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
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`✅ MongoDB Connected to Atlas / External DB: ${conn.connection.host}`);
      return;
    }

    // Try local Mongo URI if provided
    try {
      const conn = await mongoose.connect(mongoUri || 'mongodb://127.0.0.1:27017/eduvibe_elearning', {
        serverSelectionTimeoutMS: 1500,
      });
      console.log(`✅ MongoDB Connected to Local Instance: ${conn.connection.host}`);
      return;
    } catch (localErr) {
      // Local Mongo not running
    }

    // Fallback to in-memory MongoDB in local dev environment (if module present)
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
      console.log('ℹ️ Running in Serverless Cloud Demo mode. Set MONGO_URI in Vercel settings for permanent database storage.');
    }
  } catch (error) {
    console.warn(`ℹ️ MongoDB Notice: ${error.message}. Running in resilient cloud mode.`);
  }
};

module.exports = connectDB;
