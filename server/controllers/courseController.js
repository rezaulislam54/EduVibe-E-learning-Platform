const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');

// @desc    Get all published courses with search, filters, sorting, and pagination
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const {
      search,
      category,
      level,
      priceType, // 'all', 'free', 'paid'
      minRating,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { status: 'published' };

    // Search by title, subtitle, or tags
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Level filter
    if (level && level !== 'All Levels') {
      query.level = level;
    }

    // Price filter
    if (priceType === 'free') {
      query.price = 0;
    } else if (priceType === 'paid') {
      query.price = { $gt: 0 };
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Sorting
    let sortOptions = {};
    if (sort === 'popular') {
      sortOptions = { studentsEnrolled: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'price-low') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-high') {
      sortOptions = { price: -1 };
    } else {
      // Default: newest
      sortOptions = { createdAt: -1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate('instructor', 'name avatar headline bio')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve courses',
    });
  }
};

// @desc    Get featured courses for home page
// @route   GET /api/courses/featured
// @access  Public
const getFeaturedCourses = async (req, res) => {
  try {
    const featured = await Course.find({ status: 'published' })
      .populate('instructor', 'name avatar headline')
      .sort({ rating: -1, studentsEnrolled: -1 })
      .limit(6);

    res.json({
      success: true,
      courses: featured,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve featured courses',
    });
  }
};

// @desc    Get single course by ID or slug with reviews and enrollment status
// @route   GET /api/courses/:id
// @access  Public (Optional auth for enrollment check)
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar headline bio website github linkedin');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if current requesting user is enrolled
    let isEnrolled = false;
    let enrollment = null;

    if (req.user) {
      enrollment = await Enrollment.findOne({
        user: req.user._id,
        course: course._id,
      });
      if (enrollment) {
        isEnrolled = true;
      }
    }

    // Fetch latest reviews
    const reviews = await Review.find({ course: course._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      course,
      isEnrolled,
      enrollment,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve course details',
    });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Instructor or Admin)
const createCourse = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      category,
      level,
      language,
      price,
      discountPrice,
      thumbnail,
      trailerUrl,
      learningObjectives,
      requirements,
      targetAudience,
      sections,
      tags,
      status,
    } = req.body;

    const newCourse = await Course.create({
      title,
      subtitle,
      description,
      category,
      level,
      language,
      price: Number(price) || 0,
      discountPrice: Number(discountPrice) || 0,
      isFree: Number(price) === 0,
      thumbnail: thumbnail || undefined,
      trailerUrl: trailerUrl || undefined,
      learningObjectives: learningObjectives || [],
      requirements: requirements || [],
      targetAudience: targetAudience || [],
      sections: sections || [],
      tags: tags || [],
      instructor: req.user._id,
      status: status || 'published', // default to published for immediate feedback
    });

    res.status(201).json({
      success: true,
      course: newCourse,
      message: 'Course created successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create course',
    });
  }
};

// @desc    Update an existing course
// @route   PUT /api/courses/:id
// @access  Private (Instructor owner or Admin)
const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Verify ownership or admin role
    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this course',
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('instructor', 'name avatar headline bio');

    res.json({
      success: true,
      course,
      message: 'Course updated successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update course',
    });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor owner or Admin)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Verify ownership or admin role
    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this course',
      });
    }

    await Course.findByIdAndDelete(req.params.id);
    // Also remove related enrollments and reviews
    await Enrollment.deleteMany({ course: req.params.id });
    await Review.deleteMany({ course: req.params.id });

    res.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete course',
    });
  }
};

// @desc    Get courses created by current logged-in instructor
// @route   GET /api/courses/instructor/my-courses
// @access  Private (Instructor)
const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).sort({
      createdAt: -1,
    });

    const totalStudents = courses.reduce(
      (acc, c) => acc + (c.studentsEnrolled || 0),
      0
    );
    const totalRevenue = courses.reduce(
      (acc, c) => acc + (c.studentsEnrolled || 0) * (c.discountPrice || c.price || 0),
      0
    );
    const avgRating =
      courses.length > 0
        ? (
            courses.reduce((acc, c) => acc + (c.rating || 0), 0) /
            courses.length
          ).toFixed(1)
        : 0;

    res.json({
      success: true,
      stats: {
        totalCourses: courses.length,
        totalStudents,
        totalRevenue,
        avgRating,
      },
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve instructor courses',
    });
  }
};

// @desc    Get category statistics
// @route   GET /api/courses/categories/stats
// @access  Public
const getCategoryStats = async (req, res) => {
  try {
    const stats = await Course.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      categories: stats.map((s) => ({ name: s._id, count: s.count })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve category stats',
    });
  }
};

module.exports = {
  getCourses,
  getFeaturedCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  getCategoryStats,
};
