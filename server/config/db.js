const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    // First try standard connection
    if (mongoUri && !mongoUri.includes('localhost:27017')) {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 4000
      });
      console.log(`✅ MongoDB Connected to Atlas / External DB: ${conn.connection.host}`);
      return;
    }

    // Try local Mongo URI if provided
    try {
      const conn = await mongoose.connect(mongoUri || 'mongodb://127.0.0.1:27017/eduvibe_elearning', {
        serverSelectionTimeoutMS: 2000
      });
      console.log(`✅ MongoDB Connected to Local Instance: ${conn.connection.host}`);
      return;
    } catch (localErr) {
      console.log('ℹ️  No local MongoDB daemon detected. Initializing embedded Mongo Memory instance for seamless zero-config operation...');
    }

    // Fallback to in-memory MongoDB
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongod = await MongoMemoryServer.create({
      instance: {
        dbName: 'eduvibe_elearning'
      }
    });
    const memoryUri = mongod.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`✅ Embedded MongoDB In-Memory Server Connected: ${conn.connection.host}`);
    console.log(`ℹ️  Data will be available in memory and auto-seeded if empty.`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
