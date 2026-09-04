const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const mockDataStore = require('../services/mockDataStore');

// Protect routes - Verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'eduvibe_jwt_secret_key_default'
      );

      // Try database lookup if MongoDB is active
      if (mongoose.connection.readyState === 1) {
        try {
          const user = await User.findById(decoded.id).select('-password');
          if (user) {
            req.user = user;
            return next();
          }
        } catch (dbErr) {
          // Fallback to mock user below
        }
      }

      // Mock data store lookup fallback
      const mockUser = mockDataStore.findUserById(decoded.id) || {
        _id: decoded.id,
        role: decoded.role || 'student',
        name: decoded.role === 'admin' ? 'EduVibe Admin' : 'EduVibe Member',
        email: `${decoded.role || 'user'}@eduvibe.com`,
      };

      req.user = mockUser;
      return next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid or expired token',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
