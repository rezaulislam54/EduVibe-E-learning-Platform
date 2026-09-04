const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route files
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Express Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Background DB connector (non-blocking)
let dbInitAttempted = false;
app.use((req, res, next) => {
  if (!dbInitAttempted && process.env.MONGO_URI) {
    dbInitAttempted = true;
    connectDB().catch(() => {});
  }
  next();
});

// Health Check API
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    service: 'EduVibe E-Learning Platform Backend API',
    uptime: process.uptime(),
  });
});

// API Routes - support both with /api and without /api prefixes for Vercel
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/courses', '/courses'], courseRoutes);
app.use(['/api/enrollments', '/enrollments'], enrollmentRoutes);
app.use(['/api/payments', '/payments'], paymentRoutes);
app.use(['/api/reviews', '/reviews'], reviewRoutes);
app.use(['/api/discussions', '/discussions'], discussionRoutes);
app.use(['/api/admin', '/admin'], adminRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
