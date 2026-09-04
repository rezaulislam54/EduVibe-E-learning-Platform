const express = require('express');
const router = express.Router();
const {
  addReview,
  getCourseReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:courseId', getCourseReviews);
router.post('/:courseId', protect, addReview);

module.exports = router;
