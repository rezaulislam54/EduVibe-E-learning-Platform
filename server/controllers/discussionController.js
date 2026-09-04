const Discussion = require('../models/Discussion');
const Course = require('../models/Course');

// @desc    Get all discussions for a course lesson
// @route   GET /api/discussions/course/:courseId/lesson/:lessonId
// @access  Private
const getLessonDiscussions = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const discussions = await Discussion.find({
      course: courseId,
      lessonId,
    })
      .populate('user', 'name avatar role headline')
      .populate('replies.user', 'name avatar role headline')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: discussions.length,
      discussions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve discussions',
    });
  }
};

// @desc    Post a new question/discussion thread
// @route   POST /api/discussions/course/:courseId/lesson/:lessonId
// @access  Private
const postQuestion = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { title, content, lessonTitle } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and question content',
      });
    }

    const discussion = await Discussion.create({
      course: courseId,
      lessonId,
      lessonTitle: lessonTitle || '',
      user: req.user._id,
      title,
      content,
      replies: [],
    });

    const populated = await Discussion.findById(discussion._id).populate(
      'user',
      'name avatar role headline'
    );

    // Emit real-time notification if socket is connected
    const io = req.app.get('io');
    if (io) {
      io.to(`course_${courseId}`).emit('new_discussion', populated);
    }

    res.status(201).json({
      success: true,
      discussion: populated,
      message: 'Question posted successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to post question',
    });
  }
};

// @desc    Reply to a discussion question
// @route   POST /api/discussions/:discussionId/reply
// @access  Private
const replyQuestion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Reply content cannot be empty',
      });
    }

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion thread not found',
      });
    }

    const isInstructor = req.user.role === 'instructor' || req.user.role === 'admin';

    discussion.replies.push({
      user: req.user._id,
      content,
      isInstructor,
      createdAt: new Date(),
    });

    await discussion.save();

    const updated = await Discussion.findById(discussionId)
      .populate('user', 'name avatar role headline')
      .populate('replies.user', 'name avatar role headline');

    const io = req.app.get('io');
    if (io) {
      io.to(`course_${discussion.course}`).emit('new_reply', {
        discussionId,
        discussion: updated,
      });
    }

    res.status(201).json({
      success: true,
      discussion: updated,
      message: 'Reply posted successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to post reply',
    });
  }
};

// @desc    Upvote a discussion question
// @route   PUT /api/discussions/:discussionId/upvote
// @access  Private
const toggleUpvote = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found',
      });
    }

    const userIdStr = req.user._id.toString();
    const upvotedIndex = discussion.upvotes.findIndex(
      (id) => id.toString() === userIdStr
    );

    if (upvotedIndex > -1) {
      discussion.upvotes.splice(upvotedIndex, 1);
    } else {
      discussion.upvotes.push(req.user._id);
    }

    await discussion.save();

    res.json({
      success: true,
      upvotesCount: discussion.upvotes.length,
      hasUpvoted: upvotedIndex === -1,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to toggle upvote',
    });
  }
};

module.exports = {
  getLessonDiscussions,
  postQuestion,
  replyQuestion,
  toggleUpvote,
};
