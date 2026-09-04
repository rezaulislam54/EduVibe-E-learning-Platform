const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getMyEnrollments,
  getEnrollmentProgress,
  updateLessonProgress,
  saveLessonNote,
  getCertificate,
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

// Public route to view / verify a certificate
router.get('/certificate/:certificateId', getCertificate);

// Protected routes
router.use(protect);
router.post('/', enrollCourse);
router.get('/my-learning', getMyEnrollments);
router.get('/course/:courseId', getEnrollmentProgress);
router.put('/course/:courseId/lesson/:lessonId', updateLessonProgress);
router.post('/course/:courseId/notes', saveLessonNote);

module.exports = router;
