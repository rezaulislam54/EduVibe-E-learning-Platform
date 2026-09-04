const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// Helper to generate verifiable certificate code
const generateCertificateId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'EDU-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// @desc    Enroll in a course (Free or Direct)
// @route   POST /api/enrollments
// @access  Private (Student)
const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
        enrollment: existing,
      });
    }

    // Create new enrollment
    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: course._id,
      completedLessons: [],
      progressPercentage: 0,
    });

    // Add to User's enrolled courses array
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { enrolledCourses: course._id },
    });

    // Increment course enrolled count
    await Course.findByIdAndUpdate(course._id, {
      $inc: { studentsEnrolled: 1 },
    });

    res.status(201).json({
      success: true,
      enrollment,
      message: `Congratulations! You have successfully enrolled in ${course.title}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to enroll in course',
    });
  }
};

// @desc    Get all enrolled courses for current user
// @route   GET /api/enrollments/my-learning
// @access  Private
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'name avatar headline',
        },
      })
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve your enrollments',
    });
  }
};

// @desc    Get specific enrollment progress & learning player data
// @route   GET /api/enrollments/course/:courseId
// @access  Private
const getEnrollmentProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate(
      'instructor',
      'name avatar headline bio'
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    let enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
    });

    // If user is instructor of this course or admin, provide full preview access even without enrollment
    const isInstructorOrAdmin =
      course.instructor._id.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!enrollment && !isInstructorOrAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to access player content',
      });
    }

    res.json({
      success: true,
      course,
      enrollment: enrollment || {
        completedLessons: [],
        progressPercentage: 0,
        isCompleted: false,
        notes: [],
      },
      isInstructorOrAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve course progress',
    });
  }
};

// @desc    Toggle / update lesson completion status
// @route   PUT /api/enrollments/course/:courseId/lesson/:lessonId
// @access  Private
const updateLessonProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { isCompleted: markCompleted } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    let enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      // Auto-enroll if not already
      enrollment = await Enrollment.create({
        user: req.user._id,
        course: courseId,
        completedLessons: [],
        progressPercentage: 0,
      });
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { enrolledCourses: courseId },
      });
    }

    // Total lessons in the course
    const totalLessons = course.totalLessons || 1;

    let completedList = enrollment.completedLessons.map((id) => id.toString());

    if (markCompleted !== false) {
      // Add lesson if not in list
      if (!completedList.includes(lessonId.toString())) {
        completedList.push(lessonId.toString());
      }
    } else {
      // Remove lesson
      completedList = completedList.filter((id) => id !== lessonId.toString());
    }

    const progressPercentage = Math.min(
      100,
      Math.round((completedList.length / totalLessons) * 100)
    );

    const isCourseFinished = progressPercentage === 100;

    enrollment.completedLessons = completedList;
    enrollment.progressPercentage = progressPercentage;
    enrollment.lastAccessedLesson = lessonId;

    if (isCourseFinished && !enrollment.isCompleted) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();
      if (!enrollment.certificateId) {
        enrollment.certificateId = generateCertificateId();
      }
    }

    await enrollment.save();

    res.json({
      success: true,
      enrollment,
      message: isCourseFinished
        ? '🎉 Congratulations! You completed the entire course! Certificate unlocked.'
        : 'Lesson progress updated',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update lesson progress',
    });
  }
};

// @desc    Save personal notes for a lesson
// @route   POST /api/enrollments/course/:courseId/notes
// @access  Private
const saveLessonNote = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonId, lessonTitle, noteText } = req.body;

    if (!lessonId || !noteText) {
      return res.status(400).json({
        success: false,
        message: 'Lesson ID and note text are required',
      });
    }

    let enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment record not found',
      });
    }

    const noteIndex = enrollment.notes.findIndex(
      (n) => n.lessonId.toString() === lessonId.toString()
    );

    if (noteIndex > -1) {
      enrollment.notes[noteIndex].noteText = noteText;
      enrollment.notes[noteIndex].updatedAt = new Date();
    } else {
      enrollment.notes.push({
        lessonId,
        lessonTitle: lessonTitle || '',
        noteText,
      });
    }

    await enrollment.save();

    res.json({
      success: true,
      notes: enrollment.notes,
      message: 'Note saved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to save note',
    });
  }
};

// @desc    Get certificate data by certificate ID
// @route   GET /api/enrollments/certificate/:certificateId
// @access  Public
const getCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const enrollment = await Enrollment.findOne({ certificateId })
      .populate('user', 'name email avatar')
      .populate({
        path: 'course',
        select: 'title category instructor totalDurationMinutes',
        populate: {
          path: 'instructor',
          select: 'name headline avatar',
        },
      });

    if (!enrollment || !enrollment.isCompleted) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or course not yet completed',
      });
    }

    res.json({
      success: true,
      certificate: {
        certificateId: enrollment.certificateId,
        studentName: enrollment.user.name,
        courseTitle: enrollment.course.title,
        category: enrollment.course.category,
        instructorName: enrollment.course.instructor.name,
        completedAt: enrollment.completedAt,
        issuedBy: 'EduVibe E-Learning Academy',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify certificate',
    });
  }
};

module.exports = {
  enrollCourse,
  getMyEnrollments,
  getEnrollmentProgress,
  updateLessonProgress,
  saveLessonNote,
  getCertificate,
};
