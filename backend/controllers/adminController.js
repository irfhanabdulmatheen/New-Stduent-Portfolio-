const User = require('../models/User');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Certification = require('../models/Certification');

// @desc    Get all students
// @route   GET /api/admin/students
exports.getStudents = async (req, res) => {
    try {
        const { search, department, skill } = req.query;
        let query = { role: 'student' };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        let students = await User.find(query).select('-password').sort({ createdAt: -1 });

        // If department filter, find matching profiles
        if (department) {
            const profiles = await Profile.find({ department: { $regex: department, $options: 'i' } });
            const userIds = profiles.map(p => p.userId.toString());
            students = students.filter(s => userIds.includes(s._id.toString()));
        }

        // If skill filter, find matching skills
        if (skill) {
            const skills = await Skill.find({ skillName: { $regex: skill, $options: 'i' } });
            const userIds = skills.map(s => s.userId.toString());
            students = students.filter(s => userIds.includes(s._id.toString()));
        }

        // Attach profile info to each student
        const studentsWithProfiles = await Promise.all(
            students.map(async (student) => {
                const profile = await Profile.findOne({ userId: student._id });
                const projectCount = await Project.countDocuments({ userId: student._id });
                const skillCount = await Skill.countDocuments({ userId: student._id });
                return {
                    ...student.toObject(),
                    profile,
                    projectCount,
                    skillCount
                };
            })
        );

        res.json(studentsWithProfiles);
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single student detail
// @route   GET /api/admin/students/:id
exports.getStudentDetail = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user || user.role !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        const profile = await Profile.findOne({ userId: user._id });
        const projects = await Project.find({ userId: user._id });
        const skills = await Skill.find({ userId: user._id });
        const certifications = await Certification.find({ userId: user._id });

        res.json({ user, profile, projects, skills, certifications });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Block/Unblock student
// @route   PUT /api/admin/students/:id/block
exports.toggleBlockStudent = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({
            message: user.isActive ? 'Student activated' : 'Student blocked',
            isActive: user.isActive
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a project (admin)
// @route   DELETE /api/admin/projects/:id
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted by admin' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get analytics
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const activeStudents = await User.countDocuments({ role: 'student', isActive: true });
        const blockedStudents = await User.countDocuments({ role: 'student', isActive: false });
        const totalProjects = await Project.countDocuments();
        const totalSkills = await Skill.countDocuments();
        const totalCertifications = await Certification.countDocuments();

        // Recent students
        const recentStudents = await User.find({ role: 'student' })
            .select('name email createdAt isActive')
            .sort({ createdAt: -1 })
            .limit(5);

        // Department distribution
        const profiles = await Profile.find().populate('userId', 'role');
        const deptMap = {};
        profiles.forEach(p => {
            if (p.userId && p.userId.role === 'student' && p.department) {
                deptMap[p.department] = (deptMap[p.department] || 0) + 1;
            }
        });

        res.json({
            totalStudents,
            activeStudents,
            blockedStudents,
            totalProjects,
            totalSkills,
            totalCertifications,
            recentStudents,
            departmentDistribution: deptMap
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
