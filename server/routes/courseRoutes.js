const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  getCourses,
  getFeaturedCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  getCategoryStats,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Optional auth middleware for public routes that want to know the user if logged in
const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'eduvibe_jwt_secret_key_default'
      );
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // ignore invalid token in optional auth
    }
  }
  next();
};

router.get('/', getCourses);
router.get('/featured', getFeaturedCourses);
router.get('/categories/stats', getCategoryStats);
router.get(
  '/instructor/my-courses',
  protect,
  authorize('instructor', 'admin'),
  getInstructorCourses
);
router.get('/:id', optionalProtect, getCourseById);
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;
