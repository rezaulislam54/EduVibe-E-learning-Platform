const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const seedDB = require('./seed/seeder');
const Course = require('./models/Course');
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
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.set('io', io);

// Express Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    service: 'EduVibe E-Learning Platform Backend API',
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io Real-time Event Handling
io.on('connection', (socket) => {
  // Join course discussion room
  socket.on('join_course', (courseId) => {
    socket.join(`course_${courseId}`);
  });

  socket.on('leave_course', (courseId) => {
    socket.leave(`course_${courseId}`);
  });

  // Real-time Chat / Q&A interaction
  socket.on('send_course_message', (data) => {
    const { courseId, message, user } = data;
    io.to(`course_${courseId}`).emit('receive_course_message', {
      courseId,
      message,
      user,
      timestamp: new Date(),
    });
  });

  socket.on('disconnect', () => {
    // client disconnected
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Auto-seed if database is brand new and empty
  try {
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      console.log('🚀 Initial database empty. Auto-seeding rich demo courses and users...');
      await seedDB();
    }
  } catch (err) {
    console.warn('Auto-seed check warning:', err.message);
  }

  server.listen(PORT, () => {
    console.log(`
=====================================================
🚀 EduVibe E-Learning Backend API is Live!
📡 Port: ${PORT}
🌐 Mode: ${process.env.NODE_ENV || 'development'}
🔥 Health: http://localhost:${PORT}/api/health
=====================================================
    `);
  });
};

startServer();
