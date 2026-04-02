const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Certification = require('../models/Certification');
const User = require('../models/User');
const Placement = require('../models/Placement');

// ==================== PROFILE ====================

// @desc    Get student profile
// @route   GET /api/student/profile
exports.getProfile = async (req, res) => {
    try {
        let profile = await Profile.findOne({ userId: req.user._id });
        if (!profile) {
            profile = await Profile.create({ userId: req.user._id });
        }
        const user = await User.findById(req.user._id).select('name email');
        res.json({ profile, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
exports.updateProfile = async (req, res) => {
    try {
        const { bio, phone, name, department, year, rollNo, degree, currentArrears, cgpaSemesters, cgpa } = req.body;
        const updateData = {};
        if (bio !== undefined) updateData.bio = bio;
        if (phone !== undefined) updateData.phone = phone;
        if (department !== undefined) updateData.department = department;
        if (year !== undefined) updateData.year = year;
        if (rollNo !== undefined) updateData.rollNo = rollNo;
        if (degree !== undefined) updateData.degree = degree;
        if (currentArrears !== undefined) updateData.currentArrears = currentArrears;
        if (cgpa !== undefined) updateData.cgpa = cgpa;

        if (cgpaSemesters !== undefined) {
             updateData.cgpaSemesters = typeof cgpaSemesters === 'string' ? JSON.parse(cgpaSemesters) : cgpaSemesters;
        }

        if (req.file) {
            updateData.profileImage = `/uploads/${req.file.filename}`;
        }

        let profile = await Profile.findOneAndUpdate(
            { userId: req.user._id },
            { $set: updateData },
            { new: true, upsert: true }
        );

        // Update user name if provided
        if (name) {
            await User.findByIdAndUpdate(req.user._id, { name });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ==================== PROJECTS ====================

// @desc    Get all projects for the student
// @route   GET /api/student/projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a project
// @route   POST /api/student/projects
exports.addProject = async (req, res) => {
    try {
        const { title, description, technologies, githubLink } = req.body;
        const cleanTitle = title?.trim();

        if (!cleanTitle) {
            return res.status(400).json({ message: 'Project title is required' });
        }

        const projectData = {
            userId: req.user._id,
            title: cleanTitle,
            description: description?.trim() || '',
            technologies: typeof technologies === 'string'
                ? technologies.split(',').map(t => t.trim()).filter(Boolean)
                : Array.isArray(technologies)
                    ? technologies.map(t => String(t).trim()).filter(Boolean)
                    : [],
            githubLink: githubLink?.trim() || ''
        };

        if (req.file) {
            projectData.image = `/uploads/${req.file.filename}`;
        }

        const project = await Project.create(projectData);
        res.status(201).json(project);
    } catch (error) {
        console.error('Add project error:', error);
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Unable to add project right now' });
    }
};

// @desc    Update a project
// @route   PUT /api/student/projects/:id
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const { title, description, technologies, githubLink } = req.body;
        if (title !== undefined) {
            const cleanTitle = title.trim();
            if (!cleanTitle) {
                return res.status(400).json({ message: 'Project title is required' });
            }
            project.title = cleanTitle;
        }
        if (description !== undefined) {
            project.description = description.trim();
        }
        if (githubLink !== undefined) {
            project.githubLink = githubLink.trim();
        }
        if (technologies !== undefined) {
            project.technologies = typeof technologies === 'string'
                ? technologies.split(',').map(t => t.trim()).filter(Boolean)
                : Array.isArray(technologies)
                    ? technologies.map(t => String(t).trim()).filter(Boolean)
                    : [];
        }
        if (req.file) {
            project.image = `/uploads/${req.file.filename}`;
        }

        await project.save();
        res.json(project);
    } catch (error) {
        console.error('Update project error:', error);
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Unable to update project right now' });
    }
};

// @desc    Delete a project
// @route   DELETE /api/student/projects/:id
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// ==================== CERTIFICATIONS ====================

// @desc    Get all certifications
// @route   GET /api/student/certifications
exports.getCertifications = async (req, res) => {
    try {
        const certifications = await Certification.find({ userId: req.user._id });
        res.json(certifications);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a certification
// @route   POST /api/student/certifications
exports.addCertification = async (req, res) => {
    try {
        const { courseName, issuedBy, completionDate, link } = req.body;
        const cleanCourseName = courseName?.trim();

        if (!cleanCourseName) {
            return res.status(400).json({ message: 'Course name is required' });
        }

        const certData = {
            userId: req.user._id,
            courseName: cleanCourseName,
            issuedBy: issuedBy?.trim() || '',
            completionDate: completionDate ? new Date(completionDate) : undefined,
            link: link?.trim() || ''
        };

        if (req.file) {
            certData.certificateFile = `/uploads/${req.file.filename}`;
        }

        const certification = await Certification.create(certData);
        res.status(201).json(certification);
    } catch (error) {
        console.error('Add certification error:', error);
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Unable to add certification right now' });
    }
};

// @desc    Delete a certification
// @route   DELETE /api/student/certifications/:id
exports.deleteCertification = async (req, res) => {
    try {
        const cert = await Certification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!cert) {
            return res.status(404).json({ message: 'Certification not found' });
        }
        res.json({ message: 'Certification deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ==================== PLACEMENTS ====================

// @desc    Get all placements
// @route   GET /api/student/placements
exports.getPlacements = async (req, res) => {
    try {
        const placements = await Placement.find({ userId: req.user._id });
        res.json(placements);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a placement
// @route   POST /api/student/placements
exports.addPlacement = async (req, res) => {
    try {
        const { company, role, package, date } = req.body;
        const placement = await Placement.create({
            userId: req.user._id,
            company,
            role,
            package,
            date
        });
        res.status(201).json(placement);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a placement
// @route   DELETE /api/student/placements/:id
exports.deletePlacement = async (req, res) => {
    try {
        const placement = await Placement.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!placement) {
            return res.status(404).json({ message: 'Placement not found' });
        }
        res.json({ message: 'Placement deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ==================== RESUME DATA ====================

// @desc    Get all student data for resume
// @route   GET /api/student/resume
exports.getResumeData = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        const profile = await Profile.findOne({ userId: req.user._id });
        const projects = await Project.find({ userId: req.user._id });
        const certifications = await Certification.find({ userId: req.user._id });
        const placements = await Placement.find({ userId: req.user._id });

        res.json({ user, profile, projects, certifications, placements });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
