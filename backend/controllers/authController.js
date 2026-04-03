const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Project = require('../models/Project');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register student
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()[0]?.msg || 'Invalid registration data',
                errors: errors.array()
            });
        }

        const { name, email, password } = req.body;
        const trimmedPassword = typeof password === 'string' ? password.trim() : password;
        if (!trimmedPassword || trimmedPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create user
        user = new User({ name, email, password: trimmedPassword, role: 'student' });
        await user.save();

        // Create empty profile
        await Profile.create({ userId: user._id });

        // Note: Auto-seeding of projects was removed per request.

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Login user (student or admin)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()[0]?.msg || 'Invalid login data',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();
        const normalizedPassword = password?.trim();
        if (!normalizedEmail || !normalizedPassword) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        console.log(`Login attempt for: ${email}`);

        // Check for user
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            console.log(`User not found: ${email}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        console.log(`User found: ${user.email}, role: ${user.role}`);

        // Check if active
        if (!user.isActive) {
            return res.status(403).json({ message: 'Account has been deactivated. Contact admin.' });
        }

        // Check password
        if (!user.password) {
            if (user.googleId) {
                return res.status(400).json({
                    message: 'This account uses Google sign-in. Use the Google button on the login page.'
                });
            }
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('Comparing passwords...');
        const isMatch = await user.comparePassword(normalizedPassword);
        console.log(`Password match: ${isMatch}`);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('Generating token...');
        const token = generateToken(user._id);
        console.log('Login successful');

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Google Login
// @route   POST /api/auth/google-login
exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const { name, email, sub: googleId, picture } = ticket.getPayload();

        // Check if user exists
        let user = await User.findOne({ 
            $or: [
                { googleId },
                { email }
            ]
        });

        if (user) {
            // Update googleId if not present (if they previously registered with email)
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // Create user
            user = new User({
                name,
                email,
                googleId,
                role: 'student' // Default role for new Google signups
            });
            await user.save();
            
            // Create profile
            await Profile.create({ userId: user._id });

            // Note: Auto-seeding of projects was removed per request.
        }

        // Check if active
        if (!user.isActive) {
            return res.status(403).json({ message: 'Account has been deactivated. Contact admin.' });
        }

        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                picture
            }
        });
    } catch (error) {
        console.error('Google Login error detail:', error);
        res.status(500).json({ 
            message: 'Google authentication failed', 
            error: error.message 
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
