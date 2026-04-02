const User = require('../models/User');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Certification = require('../models/Certification');

const normalizeRole = (role) => (typeof role === 'string' ? role.trim().toLowerCase() : '');

// @desc    Get all students
// @route   GET /api/admin/students
exports.getStudents = async (req, res) => {
    try {
        const { search, department } = req.query;
        // Role can be stored with different casing in existing DB rows.
        let query = { role: { $regex: '^student$', $options: 'i' } };

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

        // Attach profile info + project counts in bulk (avoid N+1 queries).
        const studentIds = students.map((s) => s._id);
        const [profiles, projectCountsAgg] = await Promise.all([
            Profile.find({ userId: { $in: studentIds } }),
            Project.aggregate([
                { $match: { userId: { $in: studentIds } } },
                { $group: { _id: '$userId', count: { $sum: 1 } } }
            ])
        ]);

        const profileMap = {};
        for (const p of profiles) {
            profileMap[p.userId.toString()] = p;
        }

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
        console.error('Get students error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single student detail
// @route   GET /api/admin/students/:id
exports.getStudentDetail = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user || normalizeRole(user.role) !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        const profile = await Profile.findOne({ userId: user._id });
        const projects = await Project.find({ userId: user._id });
        const certifications = await Certification.find({ userId: user._id });

        res.json({ user, profile, projects, certifications });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Block/Unblock student
// @route   PUT /api/admin/students/:id/block
exports.toggleBlockStudent = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || normalizeRole(user.role) !== 'student') {
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

// @desc    Get all teachers
// @route   GET /api/admin/teachers
exports.getTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: { $regex: '^teacher$', $options: 'i' } }).select('-password').sort({ createdAt: -1 });
        
        const teachersWithStats = await Promise.all(teachers.map(async (teacher) => {
            const studentCount = await Profile.countDocuments({ teacherId: teacher._id });
            return {
                ...teacher.toObject(),
                studentCount
            };
        }));

        res.json(teachersWithStats);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new user (Teacher or Student)
// @route   POST /api/admin/users
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const normalizedRole = normalizeRole(role);
        const trimmedPassword = typeof password === 'string' ? password.trim() : password;

        if (!['student', 'teacher'].includes(normalizedRole)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        user = new User({ name, email, password: trimmedPassword, role: normalizedRole });
        await user.save();

        if (normalizedRole === 'student' || normalizedRole === 'teacher') {
            await Profile.create({ userId: user._id });
        }

        res.status(201).json({ message: 'User created successfully', user: { id: user._id, name, email, role: normalizedRole }});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (normalizeRole(user.role) === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin users' });
        }

        await User.findByIdAndDelete(req.params.id);
        await Profile.findOneAndDelete({ userId: req.params.id });
        await Project.deleteMany({ userId: req.params.id });
        await Certification.deleteMany({ userId: req.params.id });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Assign student to a teacher
// @route   PUT /api/admin/students/:id/assign
exports.assignStudentToTeacher = async (req, res) => {
    try {
        const { teacherId } = req.body;
        
        const student = await User.findById(req.params.id);
        if (!student || normalizeRole(student.role) !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (teacherId) {
            const teacher = await User.findById(teacherId);
            if (!teacher || normalizeRole(teacher.role) !== 'teacher') {
                return res.status(404).json({ message: 'Teacher not found' });
            }
        }

        // Update profile
        await Profile.findOneAndUpdate(
            { userId: req.params.id },
            { teacherId: teacherId || null },
            { new: true, upsert: true }
        );

        res.json({ message: 'Student assigned successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get analytics
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
    try {
        const roleStudentQuery = { role: { $regex: '^student$', $options: 'i' } };
        const totalStudents = await User.countDocuments(roleStudentQuery);
        const activeStudents = await User.countDocuments({ ...roleStudentQuery, isActive: true });
        const blockedStudents = await User.countDocuments({ ...roleStudentQuery, isActive: false });
        const totalProjects = await Project.countDocuments();
        const totalCertifications = await Certification.countDocuments();

        // Recent students
        const recentStudents = await User.find(roleStudentQuery)
            .select('name email createdAt isActive')
            .sort({ createdAt: -1 })
            .limit(5);

        // Department distribution
        const profiles = await Profile.find().populate('userId', 'role');
        const deptMap = {};
        profiles.forEach(p => {
            if (p.userId && normalizeRole(p.userId.role) === 'student' && p.department) {
                deptMap[p.department] = (deptMap[p.department] || 0) + 1;
            }
        });

        res.json({
            totalStudents,
            activeStudents,
            blockedStudents,
            totalProjects,
            totalCertifications,
            recentStudents,
            departmentDistribution: deptMap
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get departments
// @route   GET /api/admin/departments
exports.getDepartments = async (req, res) => {
    try {
        res.json([{ id: 1, name: 'Computer Science' }, { id: 2, name: 'Electrical Engineering' }]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create department
// @route   POST /api/admin/departments
exports.createDepartment = async (req, res) => {
    try {
        res.status(201).json({ message: 'Department created', data: req.body });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
