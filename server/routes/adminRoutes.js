const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllAdminCourses,
  updateCourseStatus,
  getAllUsers,
  createAdminUser,
  updateUser,
  updateUserRole,
  resetUserPassword,
  deleteUser,
  getAllEnrollments,
  revokeEnrollment,
  getAllTransactions,
  toggleRefundTransaction,
  getAllReviews,
  deleteReview,
  reseedDatabase,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

// Platform Stats
router.get('/stats', getAdminStats);

// Course Management
router.get('/courses', getAllAdminCourses);
router.put('/courses/:id/status', updateCourseStatus);

// User Management
router.get('/users', getAllUsers);
router.post('/users', createAdminUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/reset-password', resetUserPassword);
router.delete('/users/:id', deleteUser);

// Enrollments Management
router.get('/enrollments', getAllEnrollments);
router.delete('/enrollments/:id', revokeEnrollment);

// Transactions & Orders
router.get('/transactions', getAllTransactions);
router.put('/transactions/:id/refund', toggleRefundTransaction);

// Reviews Moderation
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

// Database Seeder
router.post('/reseed', reseedDatabase);

module.exports = router;
