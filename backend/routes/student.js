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
    getCertifications,
    addCertification,
    deleteCertification,
    getPlacements,
    addPlacement,
    deletePlacement,
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


// Certifications
router.get('/certifications', getCertifications);
router.post('/certifications', upload.single('certificateFile'), addCertification);
router.delete('/certifications/:id', deleteCertification);

// Placements
router.get('/placements', getPlacements);
router.post('/placements', addPlacement);
router.delete('/placements/:id', deletePlacement);

// Resume
router.get('/resume', getResumeData);

module.exports = router;
