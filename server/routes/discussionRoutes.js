const express = require('express');
const router = express.Router();
const {
  getLessonDiscussions,
  postQuestion,
  replyQuestion,
  toggleUpvote,
} = require('../controllers/discussionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/course/:courseId/lesson/:lessonId', getLessonDiscussions);
router.post('/course/:courseId/lesson/:lessonId', postQuestion);
router.post('/:discussionId/reply', replyQuestion);
router.put('/:discussionId/upvote', toggleUpvote);

module.exports = router;
