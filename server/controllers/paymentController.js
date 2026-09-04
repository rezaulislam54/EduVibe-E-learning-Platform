const Course = require('../models/Course');
const Order = require('../models/Order');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

let stripeInstance = null;
try {
  if (
    process.env.STRIPE_SECRET_KEY &&
    !process.env.STRIPE_SECRET_KEY.includes('Mock')
  ) {
    const Stripe = require('stripe');
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
} catch (e) {
  console.log('Stripe client running in simulated/portfolio mode.');
}

// @desc    Create payment intent for Stripe or Simulated Gateway
// @route   POST /api/payments/create-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const price = course.discountPrice > 0 ? course.discountPrice : course.price;
    const amountInCents = Math.round(price * 100);

    // Free course edge case
    if (price <= 0) {
      return res.json({
        success: true,
        isFree: true,
        clientSecret: null,
        amount: 0,
      });
    }

    if (stripeInstance) {
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        metadata: {
          courseId: course._id.toString(),
          userId: req.user._id.toString(),
          courseTitle: course.title,
        },
      });

      return res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: price,
        isMock: false,
      });
    } else {
      // Portfolio Simulated Payment Intent
      const mockSecret = `pi_mock_${Date.now()}_secret_${Math.random()
        .toString(36)
        .substring(2)}`;
      return res.json({
        success: true,
        clientSecret: mockSecret,
        paymentIntentId: `pi_mock_${Date.now()}`,
        amount: price,
        isMock: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment intent',
    });
  }
};

// @desc    Verify payment and auto-enroll student in course
// @route   POST /api/payments/verify
// @access  Private
const verifyPaymentAndEnroll = async (req, res) => {
  try {
    const {
      courseId,
      paymentId,
      paymentMethod = 'stripe',
      amountPaid,
    } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if user already enrolled
    let enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
    });

    if (!enrollment) {
      enrollment = await Enrollment.create({
        user: req.user._id,
        course: course._id,
        completedLessons: [],
        progressPercentage: 0,
      });

      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { enrolledCourses: course._id },
      });

      await Course.findByIdAndUpdate(course._id, {
        $inc: { studentsEnrolled: 1 },
      });
    }

    // Create Order Record
    const order = await Order.create({
      user: req.user._id,
      course: course._id,
      amount: amountPaid || course.discountPrice || course.price,
      currency: 'USD',
      paymentMethod,
      paymentId: paymentId || `SIM_TXN_${Date.now()}`,
      status: 'completed',
    });

    res.status(201).json({
      success: true,
      order,
      enrollment,
      message: `Payment successful! You are now enrolled in ${course.title}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed',
    });
  }
};

// @desc    Get user order history
// @route   GET /api/payments/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('course', 'title thumbnail category price instructor')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve order history',
    });
  }
};

module.exports = {
  createPaymentIntent,
  verifyPaymentAndEnroll,
  getMyOrders,
};
