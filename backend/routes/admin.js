const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
    getStudents,
    getStudentDetail,
    toggleBlockStudent,
    deleteProject,
    getAnalytics
} = require('../controllers/adminController');

// All routes require auth + admin role
router.use(auth, admin);

// Students
router.get('/students', getStudents);
router.get('/students/:id', getStudentDetail);
router.put('/students/:id/block', toggleBlockStudent);

// Projects (admin can delete any)
router.delete('/projects/:id', deleteProject);

// Analytics
router.get('/analytics', getAnalytics);

module.exports = router;
