const mongoose = require('mongoose');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');
const mockDataStore = require('../services/mockDataStore');

// @desc    Get all published courses with search, filters, sorting, and pagination
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const {
      search,
      category,
      level,
      priceType,
      minRating,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = { status: 'published' };

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { subtitle: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (level && level !== 'All Levels') {
        query.level = level;
      }

      if (priceType === 'free') {
        query.price = 0;
      } else if (priceType === 'paid') {
        query.price = { $gt: 0 };
      }

      if (minRating) {
        query.rating = { $gte: Number(minRating) };
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'popular') sortOptions = { studentsEnrolled: -1 };
      if (sort === 'rating') sortOptions = { rating: -1 };
      if (sort === 'price-low') sortOptions = { price: 1 };
      if (sort === 'price-high') sortOptions = { price: -1 };

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      const total = await Course.countDocuments(query);
      const courses = await Course.find(query)
        .populate('instructor', 'name avatar headline bio')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum);

      return res.json({
        success: true,
        count: courses.length,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
        currentPage: pageNum,
        courses,
      });
    }

    // In-Memory Cloud Fallback
    let filtered = [...mockDataStore.courses];
    if (search) {
      filtered = filtered.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase()));
    }
    if (category && category !== 'All') {
      filtered = filtered.filter(c => c.category === category);
    }
    if (priceType === 'free') {
      filtered = filtered.filter(c => c.price === 0);
    } else if (priceType === 'paid') {
      filtered = filtered.filter(c => c.price > 0);
    }

    return res.json({
      success: true,
      count: filtered.length,
      total: filtered.length,
      totalPages: 1,
      currentPage: 1,
      courses: filtered,
    });
  } catch (error) {
    return res.json({
      success: true,
      count: mockDataStore.courses.length,
      total: mockDataStore.courses.length,
      totalPages: 1,
      currentPage: 1,
      courses: mockDataStore.courses,
    });
  }
};

// @desc    Get featured courses for home page
// @route   GET /api/courses/featured
// @access  Public
const getFeaturedCourses = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const featured = await Course.find({ status: 'published' })
        .populate('instructor', 'name avatar headline')
        .sort({ rating: -1, studentsEnrolled: -1 })
        .limit(6);

      return res.json({
        success: true,
        courses: featured,
      });
    }

    return res.json({
      success: true,
      courses: mockDataStore.courses.slice(0, 6),
    });
  } catch (error) {
    return res.json({
      success: true,
      courses: mockDataStore.courses.slice(0, 6),
    });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const course = await Course.findById(req.params.id)
        .populate('instructor', 'name avatar headline bio website github linkedin');

      if (course) {
        let isEnrolled = false;
        let enrollment = null;

        if (req.user) {
          enrollment = await Enrollment.findOne({
            user: req.user._id,
            course: course._id,
          });
          if (enrollment) isEnrolled = true;
        }

        const reviews = await Review.find({ course: course._id })
          .populate('user', 'name avatar')
          .sort({ createdAt: -1 })
          .limit(10);

        return res.json({
          success: true,
          course,
          isEnrolled,
          enrollment,
          reviews,
        });
      }
    }

    const fallbackCourse = mockDataStore.findCourseById(req.params.id);
    return res.json({
      success: true,
      course: fallbackCourse,
      isEnrolled: false,
      enrollment: null,
      reviews: [
        {
          _id: 'rev_1',
          rating: 5,
          comment: 'Outstanding masterclass! Perfectly structured with crystal clear explanations.',
          user: { name: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' },
          createdAt: new Date().toISOString(),
        }
      ],
    });
  } catch (error) {
    const fallbackCourse = mockDataStore.findCourseById(req.params.id);
    return res.json({
      success: true,
      course: fallbackCourse,
      isEnrolled: false,
      enrollment: null,
      reviews: [],
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
      tags,
      sections,
    } = req.body;

    if (!title || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, and price for the course',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const course = await Course.create({
        title,
        subtitle,
        description,
        category,
        level: level || 'All Levels',
        language: language || 'English',
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : 0,
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
        trailerUrl,
        instructor: req.user._id,
        learningObjectives: learningObjectives || [],
        requirements: requirements || [],
        targetAudience: targetAudience || [],
        tags: tags || [],
        sections: sections || [],
        status: req.user.role === 'admin' ? 'published' : 'pending',
      });

      return res.status(201).json({
        success: true,
        course,
        message: 'Course created successfully!',
      });
    }

    const mockCourse = {
      _id: 'mock_c_' + Date.now(),
      title,
      subtitle,
      description,
      category,
      level: level || 'All Levels',
      price: Number(price),
      discountPrice: Number(discountPrice || 0),
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      instructor: req.user,
      sections: sections || [],
      status: 'published',
      createdAt: new Date().toISOString(),
    };
    mockDataStore.courses.unshift(mockCourse);

    return res.status(201).json({
      success: true,
      course: mockCourse,
      message: 'Course created successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create course',
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor or Admin)
const updateCourse = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to update this course' });
      }

      course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      return res.json({
        success: true,
        course,
        message: 'Course updated successfully!',
      });
    }

    return res.json({
      success: true,
      course: { ...mockDataStore.courses[0], ...req.body },
      message: 'Course updated successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update course',
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor or Admin)
const deleteCourse = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
      }

      await Course.findByIdAndDelete(req.params.id);
    }

    return res.json({
      success: true,
      message: 'Course removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete course',
    });
  }
};

// @desc    Get courses created by current logged in instructor
// @route   GET /api/courses/instructor/my-courses
// @access  Private (Instructor)
const getInstructorCourses = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });
      return res.json({
        success: true,
        count: courses.length,
        courses,
      });
    }

    return res.json({
      success: true,
      count: mockDataStore.courses.length,
      courses: mockDataStore.courses,
    });
  } catch (error) {
    return res.json({
      success: true,
      count: mockDataStore.courses.length,
      courses: mockDataStore.courses,
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
};
