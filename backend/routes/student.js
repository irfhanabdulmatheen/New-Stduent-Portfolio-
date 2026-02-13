const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const student = require('../middleware/student');
const upload = require('../middleware/upload');
const {
    getProfile,
    updateProfile,
    getProjects,
    addProject,
    updateProject,
    deleteProject,
    getSkills,
    addSkill,
    updateSkill,
    deleteSkill,
    getCertifications,
    addCertification,
    deleteCertification,
    getResumeData
} = require('../controllers/studentController');

// All routes require auth + student role
router.use(auth, student);

// Profile
router.get('/profile', getProfile);
router.put('/profile', upload.single('profileImage'), updateProfile);

// Projects
router.get('/projects', getProjects);
router.post('/projects', upload.single('image'), addProject);
router.put('/projects/:id', upload.single('image'), updateProject);
router.delete('/projects/:id', deleteProject);

// Skills
router.get('/skills', getSkills);
router.post('/skills', addSkill);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

// Certifications
router.get('/certifications', getCertifications);
router.post('/certifications', upload.single('certificateFile'), addCertification);
router.delete('/certifications/:id', deleteCertification);

// Resume
router.get('/resume', getResumeData);

module.exports = router;
