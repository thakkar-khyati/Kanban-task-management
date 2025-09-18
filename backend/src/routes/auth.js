const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateUser } = require('../middleware/validation');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', validateUser.register, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateUser.login, login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getMe);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, validateUser.updateProfile, updateProfile);

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', protect, validateUser.changePassword, changePassword);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, logout);

module.exports = router;
