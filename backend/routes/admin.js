const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
    getStudents,
    getStudentDetail,
    toggleBlockStudent,
    deleteProject,
    getAnalytics,
    getTeachers,
    getTeacherStudents,
    createUser,
    deleteUser,
    assignStudentToTeacher,
    getDepartments,
    createDepartment
} = require('../controllers/adminController');

// All routes require auth + admin role
router.use(auth, admin);

// Students
router.get('/students', getStudents);
router.get('/students/:id', getStudentDetail);
router.put('/students/:id/block', toggleBlockStudent);
router.put('/students/:id/assign', assignStudentToTeacher);

// Teachers
router.get('/teachers', getTeachers);
router.get('/teachers/:id/students', getTeacherStudents);

// Users
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);

// Projects
router.delete('/projects/:id', deleteProject);

// Analytics
router.get('/analytics', getAnalytics);

// Departments
router.get('/departments', getDepartments);
router.post('/departments', createDepartment);

module.exports = router;
