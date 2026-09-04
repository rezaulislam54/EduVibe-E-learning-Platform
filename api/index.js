const app = require('../server/app');
const connectDB = require('../server/config/db');
const seedDB = require('../server/seed/seeder');
const Course = require('../server/models/Course');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      const count = await Course.countDocuments();
      if (count === 0) {
        await seedDB();
      }
    } catch (err) {
      console.warn('Serverless DB auto-init note:', err.message);
    }
  }
  return app(req, res);
};
