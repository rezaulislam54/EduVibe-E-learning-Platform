const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Order = require('../models/Order');

// @desc    Get overall platform statistics for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalStudents = await User.countDocuments({ role: 'student' });

    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ status: 'published' });
    const pendingCourses = await Course.countDocuments({ status: 'pending' });
    const draftCourses = await Course.countDocuments({ status: 'draft' });

    const totalEnrollments = await Enrollment.countDocuments();
    const completedEnrollments = await Enrollment.countDocuments({ isCompleted: true });

    const orders = await Order.find({ status: 'completed' });
    const totalRevenue = orders.reduce((acc, order) => acc + (order.amount || 0), 0);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .populate('course', 'title price')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          instructors: totalInstructors,
          students: totalStudents,
        },
        courses: {
          total: totalCourses,
          published: publishedCourses,
          pending: pendingCourses,
          draft: draftCourses,
        },
        enrollments: {
          total: totalEnrollments,
          completed: completedEnrollments,
        },
        financials: {
          totalRevenue,
          totalOrders: orders.length,
        },
      },
      recentUsers,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve admin stats',
    });
  }
};

// @desc    Get all courses across all instructors for admin moderation
// @route   GET /api/admin/courses
// @access  Private (Admin)
const getAllAdminCourses = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve courses for admin',
    });
  }
};

// @desc    Update course status (approve, reject, draft, published)
// @route   PUT /api/admin/courses/:id/status
// @access  Private (Admin)
const updateCourseStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['published', 'pending', 'draft', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('instructor', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.json({
      success: true,
      course,
      message: `Course status updated to ${status}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update course status',
    });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve users',
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['student', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role provided',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
      message: `User role updated to ${role}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user role',
    });
  }
};

module.exports = {
  getAdminStats,
  getAllAdminCourses,
  updateCourseStatus,
  getAllUsers,
  updateUserRole,
};
