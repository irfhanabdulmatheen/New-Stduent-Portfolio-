const User = require('../models/User');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Certification = require('../models/Certification');

// @desc    Get assigned students
// @route   GET /api/teacher/students
exports.getAssignedStudents = async (req, res) => {
    try {
        const { search } = req.query;
        let query = { role: 'student' };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Get profiles with this teacher's id
        const assignedProfiles = await Profile.find({ teacherId: req.user._id });
        const assignedStudentIds = assignedProfiles.map(p => p.userId.toString());

        // Find students that have matching names (if search) and are assigned
        let students = await User.find({
            ...query,
            _id: { $in: assignedStudentIds }
        }).select('-password').sort({ createdAt: -1 });

        // Attach profile info
        const studentsWithProfiles = await Promise.all(
            students.map(async (student) => {
                const profile = assignedProfiles.find(p => p.userId.toString() === student._id.toString());
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
        console.error('Get assigned students error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single assigned student detail
// @route   GET /api/teacher/students/:id
exports.getStudentDetail = async (req, res) => {
    try {
        const studentId = req.params.id;
        
        // Check if student is assigned to this teacher
        const profile = await Profile.findOne({ userId: studentId, teacherId: req.user._id });
        if (!profile) {
            return res.status(403).json({ message: 'Access denied or Student not found' });
        }

        const user = await User.findById(studentId).select('-password');
        if (!user || user.role !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        const projects = await Project.find({ userId: studentId });
        const skills = await Skill.find({ userId: studentId });
        const certifications = await Certification.find({ userId: studentId });

        res.json({ user, profile, projects, skills, certifications });
    } catch (error) {
        console.error('Teacher get student detail error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update project status
// @route   PUT /api/teacher/projects/:id/status
exports.updateProjectStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if student is assigned to this teacher
        const profile = await Profile.findOne({ userId: project.userId, teacherId: req.user._id });
        if (!profile) {
            return res.status(403).json({ message: 'Access denied. Student not assigned to you.' });
        }

        project.status = status;
        await project.save();

        res.json(project);
    } catch (error) {
        console.error('Teacher update project status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update certification status
// @route   PUT /api/teacher/certifications/:id/status
exports.updateCertificationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const cert = await Certification.findById(req.params.id);
        if (!cert) {
            return res.status(404).json({ message: 'Certification not found' });
        }

        // Check if student is assigned to this teacher
        const profile = await Profile.findOne({ userId: cert.userId, teacherId: req.user._id });
        if (!profile) {
            return res.status(403).json({ message: 'Access denied. Student not assigned to you.' });
        }

        cert.status = status;
        await cert.save();

        res.json(cert);
    } catch (error) {
        console.error('Teacher update certification status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
