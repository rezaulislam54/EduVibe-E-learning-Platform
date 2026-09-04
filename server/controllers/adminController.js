const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Order = require('../models/Order');
const Review = require('../models/Review');
const seedDB = require('../seed/seeder');

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

    const totalReviews = await Review.countDocuments();

    // Category distribution
    const categoryStats = await Course.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
    const recentOrders = await Order.find()
      .populate('user', 'name email avatar')
      .populate('course', 'title price thumbnail')
      .sort({ createdAt: -1 })
      .limit(6);

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
          completionRate:
            totalEnrollments > 0
              ? Math.round((completedEnrollments / totalEnrollments) * 100)
              : 0,
        },
        financials: {
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
          totalOrders: orders.length,
          avgOrderValue:
            orders.length > 0 ? parseFloat((totalRevenue / orders.length).toFixed(2)) : 0,
        },
        reviews: {
          total: totalReviews,
        },
        categoryStats,
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
    const { status, search, category } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email avatar headline')
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
      message: `Course status updated to ${status.toUpperCase()}`,
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
      .populate('enrolledCourses', 'title')
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

// @desc    Create new user from admin console
// @route   POST /api/admin/users
// @access  Private (Admin)
const createAdminUser = async (req, res) => {
  try {
    const { name, email, password, role, headline, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'student',
      headline: headline || `${(role || 'student').toUpperCase()} Account`,
      bio: bio || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    });

    res.status(201).json({
      success: true,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        headline: newUser.headline,
        createdAt: newUser.createdAt,
      },
      message: `User ${newUser.name} created successfully as ${newUser.role}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create user',
    });
  }
};

// @desc    Update user details / role from admin
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const { name, email, role, headline, bio } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (role && ['student', 'instructor', 'admin'].includes(role)) user.role = role;
    if (headline !== undefined) user.headline = headline;
    if (bio !== undefined) user.bio = bio;

    const updated = await user.save();

    res.json({
      success: true,
      user: updated,
      message: 'User updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user',
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

// @desc    Reset password for a user
// @route   PUT /api/admin/users/:id/reset-password
// @access  Private (Admin)
const resetUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: `Password reset successfully for ${user.name}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reset password',
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    if (req.params.id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own logged-in admin account',
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Clean up user's enrollments and orders
    await Enrollment.deleteMany({ user: req.params.id });
    await Order.deleteMany({ user: req.params.id });
    await Review.deleteMany({ user: req.params.id });

    res.json({
      success: true,
      message: `User ${user.name} and related records removed`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete user',
    });
  }
};

// @desc    Get all platform student enrollments
// @route   GET /api/admin/enrollments
// @access  Private (Admin)
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('user', 'name email avatar role')
      .populate({
        path: 'course',
        select: 'title category price thumbnail instructor',
        populate: { path: 'instructor', select: 'name' },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve enrollments',
    });
  }
};

// @desc    Revoke student enrollment
// @route   DELETE /api/admin/enrollments/:id
// @access  Private (Admin)
const revokeEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    // Remove from user enrolled courses array
    await User.findByIdAndUpdate(enrollment.user, {
      $pull: { enrolledCourses: enrollment.course },
    });

    // Decrement course studentsEnrolled count
    await Course.findByIdAndUpdate(enrollment.course, {
      $inc: { studentsEnrolled: -1 },
    });

    res.json({
      success: true,
      message: 'Enrollment access revoked successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to revoke enrollment',
    });
  }
};

// @desc    Get all transactions / orders
// @route   GET /api/admin/transactions
// @access  Private (Admin)
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Order.find()
      .populate('user', 'name email avatar')
      .populate('course', 'title category price thumbnail')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve transactions',
    });
  }
};

// @desc    Refund / toggle transaction status
// @route   PUT /api/admin/transactions/:id/refund
// @access  Private (Admin)
const toggleRefundTransaction = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order transaction not found' });
    }

    order.status = order.status === 'completed' ? 'refunded' : 'completed';
    await order.save();

    res.json({
      success: true,
      order,
      message: `Transaction marked as ${order.status.toUpperCase()}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update transaction',
    });
  }
};

// @desc    Get all reviews for moderation
// @route   GET /api/admin/reviews
// @access  Private (Admin)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email avatar')
      .populate('course', 'title category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve reviews',
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/admin/reviews/:id
// @access  Private (Admin)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Recalculate course rating
    const remainingReviews = await Review.find({ course: review.course });
    if (remainingReviews.length > 0) {
      const avg =
        remainingReviews.reduce((acc, r) => acc + r.rating, 0) /
        remainingReviews.length;
      await Course.findByIdAndUpdate(review.course, {
        rating: parseFloat(avg.toFixed(1)),
        numReviews: remainingReviews.length,
      });
    } else {
      await Course.findByIdAndUpdate(review.course, { rating: 5, numReviews: 0 });
    }

    res.json({
      success: true,
      message: 'Review deleted and course rating updated',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete review',
    });
  }
};

// @desc    1-Click Database Reset & Re-Seed from Admin
// @route   POST /api/admin/reseed
// @access  Private (Admin)
const reseedDatabase = async (req, res) => {
  try {
    await seedDB();
    res.json({
      success: true,
      message: 'Platform database successfully reset and re-seeded with demo data!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reseed database',
    });
  }
};

module.exports = {
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
};
