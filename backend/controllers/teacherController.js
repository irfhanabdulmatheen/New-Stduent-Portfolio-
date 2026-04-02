const User = require('../models/User');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Certification = require('../models/Certification');

const normalizeRole = (role) => (typeof role === 'string' ? role.trim().toLowerCase() : '');

// @desc    Get assigned students
// @route   GET /api/teacher/students
exports.getAssignedStudents = async (req, res) => {
    try {
        const { search } = req.query;
        // Role can be stored with different casing in existing DB rows.
        let query = { role: { $regex: '^student$', $options: 'i' } };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Get profiles with this teacher's id
        const assignedProfiles = await Profile.find({ teacherId: req.user._id });
        // Keep ObjectIds for Mongo aggregation matching.
        const assignedStudentIds = assignedProfiles.map(p => p.userId);

        // Find students that have matching names (if search) and are assigned
        let students = await User.find({
            ...query,
            _id: { $in: assignedStudentIds }
        }).select('-password').sort({ createdAt: -1 });

        // Attach profile info + project counts in bulk (avoid N+1 queries).
        const profileMap = {};
        for (const p of assignedProfiles) {
            profileMap[p.userId.toString()] = p;
        }

        const projectCountsAgg = await Project.aggregate([
            { $match: { userId: { $in: assignedStudentIds } } },
            { $group: { _id: '$userId', count: { $sum: 1 } } }
        ]);

        const projectCountMap = {};
        for (const item of projectCountsAgg) {
            projectCountMap[item._id.toString()] = item.count;
        }

        const studentsWithProfiles = students.map((student) => ({
            ...student.toObject(),
            profile: profileMap[student._id.toString()] || null,
            projectCount: projectCountMap[student._id.toString()] || 0
        }));

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
        if (!user || normalizeRole(user.role) !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        const projects = await Project.find({ userId: studentId });
        const certifications = await Certification.find({ userId: studentId });

        res.json({ user, profile, projects, certifications });
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

// @desc    Add a teacher review (placeholder)
// @route   POST /api/teacher/reviews
exports.addReview = async (req, res) => {
    try {
        const { studentId, rating, feedback } = req.body;
        if (!studentId || !rating || !feedback) {
            return res.status(400).json({ message: 'Please provide studentId, rating and feedback' });
        }

        // TODO: implement persistent Review model in future.
        res.status(200).json({ message: 'Review received', review: { studentId, rating, feedback, teacherId: req.user._id, createdAt: new Date() } });
    } catch (error) {
        console.error('Teacher add review error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get teacher reports (basic summary)
// @route   GET /api/teacher/reports
exports.getReports = async (req, res) => {
    try {
        const assignedProfiles = await Profile.find({ teacherId: req.user._id });
        const studentIds = assignedProfiles.map(p => p.userId);

        const projectCount = await Project.countDocuments({ userId: { $in: studentIds } });
        const certificationCount = await Certification.countDocuments({ userId: { $in: studentIds } });

        res.json({
            studentCount: studentIds.length,
            projectCount,
            certificationCount,
            assignedProfiles
        });
    } catch (error) {
        console.error('Teacher get reports error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
