const Review = require('../models/Review');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Helper to recalculate course rating
const recalculateCourseRating = async (courseId) => {
  const reviews = await Review.find({ course: courseId });
  if (reviews.length === 0) {
    await Course.findByIdAndUpdate(courseId, { rating: 5, numReviews: 0 });
    return;
  }
  const avg =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  await Course.findByIdAndUpdate(courseId, {
    rating: parseFloat(avg.toFixed(1)),
    numReviews: reviews.length,
  });
};

// @desc    Add or update review for a course
// @route   POST /api/reviews/:courseId
// @access  Private
const addReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both rating and comment',
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if user is enrolled
    const isEnrolled = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (!isEnrolled && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to leave a review',
      });
    }

    // Upsert review
    let review = await Review.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (review) {
      review.rating = Number(rating);
      review.comment = comment;
      await review.save();
    } else {
      review = await Review.create({
        user: req.user._id,
        course: courseId,
        rating: Number(rating),
        comment,
      });
    }

    await recalculateCourseRating(courseId);

    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name avatar'
    );

    res.status(201).json({
      success: true,
      review: populatedReview,
      message: 'Review submitted successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit review',
    });
  }
};

// @desc    Get all reviews for a course
// @route   GET /api/reviews/:courseId
// @access  Public
const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    const reviews = await Review.find({ course: courseId })
      .populate('user', 'name avatar headline')
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

module.exports = {
  addReview,
  getCourseReviews,
};
