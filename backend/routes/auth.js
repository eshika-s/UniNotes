const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, forgotPassword } = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   POST api/auth/forgot-password
// @desc    Simulate forgot password reset email
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   GET api/auth/me
// @desc    Get logged in user
// @access  Private
router.get('/me', auth, getUser);

module.exports = router;
