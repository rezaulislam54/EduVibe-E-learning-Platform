const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    // Role can only be student or instructor when self-registering
    const assignedRole = role === 'instructor' ? 'instructor' : 'student';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        name
      )}`,
    });

    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        headline: user.headline,
        bio: user.bio,
      },
      message: 'Account created successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Check for user (include password field which is select: false)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = user.generateAuthToken();

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        headline: user.headline,
        bio: user.bio,
      },
      message: `Welcome back, ${user.name}!`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses', 'title thumbnail category level rating studentsEnrolled')
      .select('-password');

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user profile',
    });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, headline, bio, avatar, website, github, linkedin } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (headline !== undefined) user.headline = headline;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (website !== undefined) user.website = website;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        headline: updatedUser.headline,
        bio: updatedUser.bio,
        website: updatedUser.website,
        github: updatedUser.github,
        linkedin: updatedUser.linkedin,
      },
      message: 'Profile updated successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to change password',
    });
  }
};

// @desc    1-Click Demo Login for quick testing & portfolio showcases
// @route   POST /api/auth/demo-login
// @access  Public
const demoLogin = async (req, res) => {
  try {
    const { role } = req.body; // 'student' | 'instructor' | 'admin'
    const targetRole = ['student', 'instructor', 'admin'].includes(role)
      ? role
      : 'student';

    // Find first user with this role
    let user = await User.findOne({ role: targetRole });

    if (!user) {
      // Fallback create demo user if not existing
      const demoNames = {
        student: 'Alex Student',
        instructor: 'Dr. Sarah Wilson',
        admin: 'EduVibe Administrator',
      };
      const demoEmails = {
        student: 'student@eduvibe.com',
        instructor: 'sarah.instructor@eduvibe.com',
        admin: 'admin@eduvibe.com',
      };

      user = await User.create({
        name: demoNames[targetRole],
        email: demoEmails[targetRole],
        password: 'password123',
        role: targetRole,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetRole}`,
        headline: `${targetRole.toUpperCase()} Demo Account`,
      });
    }

    const token = user.generateAuthToken();

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        headline: user.headline,
        bio: user.bio,
      },
      message: `Logged in as Demo ${targetRole.toUpperCase()}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to perform demo login',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  demoLogin,
};
