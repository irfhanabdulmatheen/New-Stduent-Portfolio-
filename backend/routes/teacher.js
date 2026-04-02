const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const teacher = require('../middleware/teacher');
const {
    getAssignedStudents,
    getStudentDetail,
    updateProjectStatus,
    updateCertificationStatus,
    addReview,
    getReports
} = require('../controllers/teacherController');

// All routes require auth + teacher role
router.use(auth, teacher);

router.get('/students', getAssignedStudents);
router.get('/students/:id', getStudentDetail);
router.put('/projects/:id/status', updateProjectStatus);
router.put('/certifications/:id/status', updateCertificationStatus);
router.post('/reviews', addReview);
router.get('/reports', getReports);

module.exports = router;
