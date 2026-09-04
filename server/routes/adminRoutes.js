const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllAdminCourses,
  updateCourseStatus,
  getAllUsers,
  updateUserRole,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/courses', getAllAdminCourses);
router.put('/courses/:id/status', updateCourseStatus);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
