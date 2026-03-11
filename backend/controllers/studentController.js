const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Certification = require('../models/Certification');
const User = require('../models/User');

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
        const { bio, phone, name } = req.body;
        const updateData = { bio, phone };

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
        const projectData = {
            userId: req.user._id,
            title,
            description,
            technologies: typeof technologies === 'string' ? technologies.split(',').map(t => t.trim()) : technologies,
            githubLink
        };

        if (req.file) {
            projectData.image = `/uploads/${req.file.filename}`;
        }

        const project = await Project.create(projectData);
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
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
        project.title = title || project.title;
        project.description = description || project.description;
        project.githubLink = githubLink || project.githubLink;
        if (technologies) {
            project.technologies = typeof technologies === 'string' ? technologies.split(',').map(t => t.trim()) : technologies;
        }
        if (req.file) {
            project.image = `/uploads/${req.file.filename}`;
        }

        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
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

// ==================== SKILLS ====================

// @desc    Get all skills
// @route   GET /api/student/skills
exports.getSkills = async (req, res) => {
    try {
        const skills = await Skill.find({ userId: req.user._id });
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a skill
// @route   POST /api/student/skills
exports.addSkill = async (req, res) => {
    try {
        const { skillName, level, experience } = req.body;
        const skill = await Skill.create({
            userId: req.user._id,
            skillName,
            level,
            experience
        });
        res.status(201).json(skill);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a skill
// @route   PUT /api/student/skills/:id
exports.updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.json(skill);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a skill
// @route   DELETE /api/student/skills/:id
exports.deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.json({ message: 'Skill deleted' });
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
        const { courseName, issuedBy, completionDate } = req.body;
        const certData = {
            userId: req.user._id,
            courseName,
            issuedBy,
            completionDate
        };

        if (req.file) {
            certData.certificateFile = `/uploads/${req.file.filename}`;
        }

        const certification = await Certification.create(certData);
        res.status(201).json(certification);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
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

// ==================== RESUME DATA ====================

// @desc    Get all student data for resume
// @route   GET /api/student/resume
exports.getResumeData = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        const profile = await Profile.findOne({ userId: req.user._id });
        const projects = await Project.find({ userId: req.user._id });
        const skills = await Skill.find({ userId: req.user._id });
        const certifications = await Certification.find({ userId: req.user._id });

        res.json({ user, profile, projects, skills, certifications });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
