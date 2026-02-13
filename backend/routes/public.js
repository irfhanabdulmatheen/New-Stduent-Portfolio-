const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Certification = require('../models/Certification');

// @desc    Get public portfolio by user name
// @route   GET /api/portfolio/:username
router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({
            name: { $regex: new RegExp(`^${req.params.username}$`, 'i') },
            role: 'student',
            isActive: true
        }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        const profile = await Profile.findOne({ userId: user._id });
        const projects = await Project.find({ userId: user._id });
        const skills = await Skill.find({ userId: user._id });
        const certifications = await Certification.find({ userId: user._id });

        res.json({ user, profile, projects, skills, certifications });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
