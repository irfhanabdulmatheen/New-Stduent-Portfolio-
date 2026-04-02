const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getMe, googleLogin } = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
router.post('/register', [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be 6+ characters').isLength({ min: 6 })
], register);

// @route   POST /api/auth/login
router.post('/login', [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
], login);

// @route   POST /api/auth/google-login
router.post('/google-login', googleLogin);

// @route   GET /api/auth/me
router.get('/me', auth, getMe);

module.exports = router;
